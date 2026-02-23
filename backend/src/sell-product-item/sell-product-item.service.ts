// src/sell/services/sell-product-item.service.ts
import { Injectable, HttpException, Logger } from '@nestjs/common';
import { TenantConnectionService } from 'lib/connection/mongooseConnection.service';
import { globalProducts, globalSells } from 'lib/global-db/globaldb';
import { ShortProductSchema, ShortProductDocument } from '../product/entities/short-product.schema';
import { OrderStatus, Sell, SellSchema, SellDocument } from './entities/sell-product-item.entity';
import { CreateSellProductItemDto, GetOrdersDto, MySellsDto, SellsType } from './dto/create-sell-product-item.dto';
import { randomBytes, randomUUID } from "crypto";
import { MeilisearchService } from 'src/meilisearch/meilisearch.service';
import { ObjectId, PipelineStage, Types } from 'mongoose';
import { UserRole } from 'src/user/entities/user.schema';

@Injectable()
export class SellProductItemService {
  private logger = new Logger(SellProductItemService.name);
  constructor(private tenant: TenantConnectionService,private milieSeach:MeilisearchService) {}

  private sellModel() {
    return this.tenant.getModel<SellDocument>(globalSells, Sell.name, SellSchema);
  }

  private shortProductModel() {
    return this.tenant.getModel<ShortProductDocument>(globalProducts, 'ShortProduct', ShortProductSchema);
  }
  private generateOrderUUID() {
   const time = Date.now().toString(36).toUpperCase(); // compact timestamp
  const rand = randomBytes(6).toString("hex").toUpperCase(); // 12 hex characters (48 bits)
  return `ORD-${time}${rand}`;
}

  /**
   * ✅ UPDATED: Case-insensitive variant matching
   */
  private findVariant(variants: any[], variantSize: string, variantColor: string) {
    return variants?.find(
      (v: any) => 
        v.size.toLowerCase().trim() === variantSize.toLowerCase().trim() && 
        v.color.toLowerCase().trim() === variantColor.toLowerCase().trim()
    );
  }

  /**
   * ✅ UPDATED: Create Sell - Use ShortProduct ONLY
   */
  async createSell(dto: CreateSellProductItemDto) {
    const ShortProductModel = this.shortProductModel();
    const SellModel = this.sellModel();

    // Group products by vendor with variant tracking
    const vendorGroups: Record<string, any[]> = {};

    for (const item of dto.products) {
      // ✅ CHANGED: Query ShortProduct (faster, already has variant info)
      const shortProduct = await ShortProductModel.findOne({ slug: item.slug });
      if (!shortProduct) throw new HttpException(`Product not found: ${item.slug}`, 404);

      // ✅ NEW: Find specific variant from ShortProduct
      const variant = this.findVariant(shortProduct.variants, item.variant.size, item.variant.color);
      if (!variant) {
        throw new HttpException(
          `Variant not found: ${item.variant.size}-${item.variant.color} for product ${shortProduct.name}`,
          404
        );
      }

      // ✅ NEW: Check stock of THAT specific variant
      if (item.quantity > (variant.stock || 0)) {
        throw new HttpException(
          `Insufficient stock for variant ${variant.size}-${variant.color}. Available: ${variant.stock}`,
          400
        );
      }

      // ✅ NEW: Get price from variant
      const unitPrice = variant.discountPrice || variant.price;

      // ✅ NEW: Calculate total with variant-specific price
      const totalPrice = unitPrice * item.quantity;

      const productData = {
        productId: shortProduct._id,
        slug: shortProduct.slug,
        name: shortProduct.name,
        quantity: item.quantity,
        unitPrice, // Store unit price at time of order
        totalPrice,
        // ✅ CHANGED: Store variant info (NO SKU - you don't need it here)
        variant: {
          size: variant.size,
          color: variant.color,
          price: variant.price,
          discountPrice: variant.discountPrice,
        },
        brandName: shortProduct.brandName,
        brandId: shortProduct.brandId,
        mainCategory: shortProduct.main,
        category: shortProduct.category,
        vendorId: shortProduct.vendorId?.toString() || 'admin',
        vendorSlug: shortProduct.slug, // we dont have have yet so we saved product slog insted
        isAdmin: shortProduct.isAdminCreated,
       
      };

      const vendorKey = productData.vendorId;
      if (!vendorGroups[vendorKey]) vendorGroups[vendorKey] = [];
      vendorGroups[vendorKey].push(productData);
    }

    const results: any = [];
    let totalOrderAmount = 0;
    let totalDiscount = 0;

    for (const vendorId in vendorGroups) {
      const products = vendorGroups[vendorId];

      // Calculate totals for this order
      const orderTotal = products.reduce((sum, p) => sum + p.totalPrice, 0);
      const discount = products.reduce((sum, p) => {
        return sum + (p.variant.discountPrice ? (p.variant.price - p.variant.discountPrice) * p.quantity : 0);
      }, 0);

      // Create sell document
      const sellDoc = await SellModel.create({
        products,
        shipment: dto.shipment,
        ...(dto?.userId && { userId: dto.userId }),

        isAdmin: products[0].isAdmin,
        orderStatus: OrderStatus.PENDING,
        orderTotal,
        totalDiscount: discount,
        vendorId: products[0].vendorId ,
        orderNumber: this.generateOrderUUID(),
      });

      results.push(sellDoc);
      totalOrderAmount += orderTotal;
      totalDiscount += discount;
    }
    this.logger.debug(results)
  const allProducts = results.flatMap(order => order.products);
    return {
      message: 'Sell(s) created successfully',
     /*  data: results, */
      summary: { totalOrderAmount, totalDiscount },
      orderId:results?.[0]._id,
      data: {                      // <-- THIS is the object your frontend wants
    products: allProducts,
    orderTotal: totalOrderAmount,
    totalDiscount,
    shipment: dto.shipment,
    orderType : dto.shipment?.paymentMethod ?? "COD"
  }
    };
  }

  /**
   * ✅ UPDATED: Update order status - Only update ShortProduct
   */
  async updateOrderStatus(sellId: string, newStatus: OrderStatus) {
  const SellModel = this.sellModel();
  const ShortProductModel = this.shortProductModel();

  const sell = await SellModel.findById(sellId);
  if (!sell) throw new HttpException('Sell not found', 404);

  // ✅ Store previous status for cancel logic
  const previousStatus = sell.orderStatus;

  // Update order status
  sell.orderStatus = newStatus;

  // ✅ CONFIRMED: Deduct stock from both MongoDB and MeiliSearch
  if (newStatus === OrderStatus.CONFIRMED) {
    for (const orderItem of sell.products) {
      const shortProduct = await ShortProductModel.findOne({ slug: orderItem.slug });
      if (!shortProduct) throw new HttpException(`Product not found: ${orderItem.slug}`, 404);

      // Find the specific variant
      const variant = this.findVariant(
        shortProduct.variants, 
        orderItem.variant.size, 
        orderItem.variant.color
      );
      if (!variant) {
        throw new HttpException(
          `Variant not found: ${orderItem.variant.size}-${orderItem.variant.color}`,
          404
        );
      }

      // ✅ Check if enough stock
      if (variant.stock < orderItem.quantity) {
        throw new HttpException(
          `Insufficient stock for ${shortProduct.name} (${orderItem.variant.size}-${orderItem.variant.color})`,
          400
        );
      }

      // Deduct from variant stock
      variant.stock = (variant.stock || 0) - orderItem.quantity;

      // Recalculate total stock
      shortProduct.stock = shortProduct.variants?.reduce(
        (sum: number, v: any) => sum + (v.stock || 0), 
        0
      ) || 0;

      // Save MongoDB
      await shortProduct.save();

      // ✅ Update MeiliSearch
      await this.milieSeach.update(shortProduct._id.toString(), {
        stock: shortProduct.stock,
      });

      this.logger.log(
        `✅ Stock deducted: ${shortProduct.name} - New stock: ${shortProduct.stock}`
      );
    }
  }

  // ✅ CANCELLED: Add stock back ONLY if order was previously CONFIRMED
  if (newStatus === OrderStatus.CANCELLED && previousStatus === OrderStatus.CONFIRMED) {
    for (const orderItem of sell.products) {
      const shortProduct = await ShortProductModel.findOne({ slug: orderItem.slug });
      if (!shortProduct) {
        this.logger.warn(`Product not found during cancellation: ${orderItem.slug}`);
        continue; // Skip this product but continue with others
      }

      // Find the specific variant
      const variant = this.findVariant(
        shortProduct.variants, 
        orderItem.variant.size, 
        orderItem.variant.color
      );
      if (!variant) {
        this.logger.warn(
          `Variant not found during stock restoration: ${orderItem.variant.size}-${orderItem.variant.color}`
        );
        continue;
      }

      // ✅ Add stock back to variant
      variant.stock = (variant.stock || 0) + orderItem.quantity;

      // Recalculate total stock
      shortProduct.stock = shortProduct.variants?.reduce(
        (sum: number, v: any) => sum + (v.stock || 0), 
        0
      ) || 0;

      // Save MongoDB
      await shortProduct.save();

      // ✅ Update MeiliSearch
      await this.milieSeach.update(shortProduct._id.toString(), {
        stock: shortProduct.stock,
      });

      this.logger.log(
        `✅ Stock restored: ${shortProduct.name} - New stock: ${shortProduct.stock}`
      );
    }
  }

  await sell.save();
  
  return { 
    message: `Order status updated to ${newStatus}`, 
    data: sell,
    previousStatus, // Include for debugging
  };
}


  /**
   * Get sells filtered by role
   */
  async getOrders(userId: string, role: string, dto: GetOrdersDto) {
    const SellModel = this.sellModel();
    const filter: any = {};

    // Filter by role
    if (role === 'ADMIN') {
      filter.isAdmin = true;
    }
    if (role === 'VENDOR') {
      // Filter sells where at least one product belongs to this vendor
      filter['products.vendorId'] = userId;
    }

    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = dto;
    const skip = (page - 1) * limit;

    // Total count for pagination
    const total = await SellModel.countDocuments(filter);

    // Fetch paginated and sorted data
    const sells = await SellModel
      .find(filter)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return {
      message: 'Orders fetched successfully',
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: sells,
    };
  }
  async getAllOrders( dto: GetOrdersDto) {
    const SellModel = this.sellModel();
    const filter: any = {};
    if(dto?.orderStatus){
      filter.orderStatus = dto.orderStatus
    }

    

    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = dto;
    const skip = (page - 1) * limit;

    // Total count for pagination
    const total = await SellModel.countDocuments(filter);

    // Fetch paginated and sorted data
    const sells = await SellModel
      .find(filter)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return {
      message: 'Orders fetched successfully',
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: sells,
    };
  }
  async getAdminOrder( dto: GetOrdersDto) {
    const SellModel = this.sellModel();
    const filter: any = {isAdmin:true};
    if(dto?.orderStatus){
      filter.orderStatus = dto.orderStatus
    }

    

    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = dto;
    const skip = (page - 1) * limit;

    // Total count for pagination
    const total = await SellModel.countDocuments(filter);

    // Fetch paginated and sorted data
    const sells = await SellModel
      .find(filter)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return {
      message: 'Orders fetched successfully',
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: sells,
    };
  }
  async getMyOrder( dto: GetOrdersDto,id:string) {
    const SellModel = this.sellModel();
    const filter: any = {userId:id};
 if (dto?.search) {
  filter.$or = [
    { orderNumber: { $regex: dto.search, $options: 'i' } },
    { 'shipment.name': { $regex: dto.search, $options: 'i' } },
    { 'shipment.phone': { $regex: dto.search, $options: 'i' } },
  ];
}

    if(dto?.orderStatus){
      filter.orderStatus = dto.orderStatus
    }

    

    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = dto;
    const skip = (page - 1) * limit;

    // Total count for pagination
    const total = await SellModel.countDocuments(filter);

    // Fetch paginated and sorted data
    const sells = await SellModel
      .find(filter)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return {
      message: 'Orders fetched successfully',
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: sells,
    };
  }

  /**
   * Get single sell by ID
   */
  async getSellById(sellId: string) {
    const SellModel = this.sellModel();

    const sell = await SellModel.findById(sellId);
    if (!sell) throw new HttpException('Sell not found', 404);

    return { message: 'Sell fetched successfully', data: sell };
  }

  /**
   * Delete sell
   */
  async deleteSell(sellId: string) {
    const SellModel = this.sellModel();

    const sell = await SellModel.findById(sellId);
    if (!sell) throw new HttpException('Sell not found', 404);

    await SellModel.findByIdAndDelete(sellId);

    return { message: 'Sell deleted successfully' };
  }

  async checkUserBuyTheProductOrNot  (userId:string,productId:string | ObjectId) {
    this.logger.log("user-info",userId,productId)
    const SellModel = this.sellModel();
    const sell = await SellModel.findOne({userId:userId,products:{$elemMatch:{productId:productId}}}).lean();
    this.logger.log("user-buth-product",sell)
    if(sell){
      return true
    }
  }

  async getMyLastOrder (userId:string) {
    const SellModel = this.sellModel();
    const sell = await SellModel.findOne({userId:userId}).sort({createdAt:-1}).lean();
    if(sell){
      return sell
    }
  }
 private resolveRange(dto: MySellsDto) {
    const now = new Date();

    const to = new Date(now);
    to.setHours(23, 59, 59, 999);

    const type = dto?.type ?? SellsType.TODAY;

    if (type === SellsType.TODAY) {
      const from = new Date(now);
      from.setHours(0, 0, 0, 0);
      return { from, to, unit: 'day' as const, format: '%Y-%m-%d' };
    }

    if (type === SellsType.LAST_7_DAYS) {
      const from = new Date(now);
      from.setDate(from.getDate() - 6);
      from.setHours(0, 0, 0, 0);
      return { from, to, unit: 'day' as const, format: '%Y-%m-%d' };
    }

    if (type === SellsType.LAST_30_DAYS) {
      const from = new Date(now);
      from.setDate(from.getDate() - 29);
      from.setHours(0, 0, 0, 0);
      return { from, to, unit: 'day' as const, format: '%Y-%m-%d' };
    }

    if (type === SellsType.THIS_YEAR) {
      const from = new Date(now.getFullYear(), 0, 1);
      from.setHours(0, 0, 0, 0);
      return { from, to, unit: 'month' as const, format: '%Y-%m' };
    }

    // CUSTOM
    const from = dto.fromDate ? new Date(dto.fromDate) : new Date(now);
    from.setHours(0, 0, 0, 0);

    const customTo = dto.toDate ? new Date(dto.toDate) : new Date(now);
    customTo.setHours(23, 59, 59, 999);

    return { from, to: customTo, unit: 'day' as const, format: '%Y-%m-%d' };
  }

 async getMySellDashboard(dto: MySellsDto,id:string,role:string) {
    const SellModel = this.sellModel();
    const {isAdmin} = dto
    const { from, to, unit, format } = this.resolveRange(dto);

    // Use plain string list to avoid any enum/runtime surprises
    const FULFILLED_STATUSES = ["SHIPPED", "DELIVERED"] as const;

    const match: Record<string, any> = {
         orderStatus: { $ne: OrderStatus.CANCELLED }, 
      updatedAt: { $gte: from, $lte: to },
     
      ...(isAdmin ? {} : role === UserRole.ADMIN ? { isAdmin: true } : { vendorId: id }),
      
    };
    this.logger.log("match",match)

    const pipeline: PipelineStage[] = [
      { $match: match },

      // Compute totals safely:
      // - If orderTotal wasn't stored (or stays 0), fallback to sum of products.totalPrice
      {
        $addFields: {
          _orderTotalSafe: { $ifNull: ["$orderTotal", 0] },
          _itemsTotal: { $ifNull: [{ $sum: "$products.totalPrice" }, 0] },
          _discountSafe: { $ifNull: ["$totalDiscount", 0] },
        },
      },
      {
        $addFields: {
          effectiveOrderTotal: {
            $cond: [{ $gt: ["$_orderTotalSafe", 0] }, "$_orderTotalSafe", "$_itemsTotal"],
          },
        },
      },

      {
        $facet: {
          // CARDS
          cards: [
            {
              $group: {
                _id: null,

                totalOrders: { $sum: 1 },

                pendingOrders: {
                  $sum: { $cond: [{ $eq: ["$orderStatus", "PENDING"] }, 1, 0] },
                },

                pendingAmount: {
                  $sum: {
                    $cond: [{ $eq: ["$orderStatus", "PENDING"] }, "$effectiveOrderTotal", 0],
                  },
                },

                // All non-cancelled (GMV-ish)
                grossRevenueAll: { $sum: "$effectiveOrderTotal" },
                totalDiscountAll: { $sum: "$_discountSafe" },
                avgOrderValueAll: { $avg: "$effectiveOrderTotal" },

                // Fulfilled only (revenue-ish)
                grossRevenueFulfilled: {
                  $sum: {
                    $cond: [
                      { $in: ["$orderStatus", [...FULFILLED_STATUSES]] },
                      "$effectiveOrderTotal",
                      0,
                    ],
                  },
                },
              },
            },
            {
              $project: {
                _id: 0,
                totalOrders: 1,
                pendingOrders: 1,
                pendingAmount: 1,

                grossRevenueAll: 1,
                totalDiscountAll: 1,
                netRevenueAll: { $subtract: ["$grossRevenueAll", "$totalDiscountAll"] },
                avgOrderValueAll: { $ifNull: ["$avgOrderValueAll", 0] },

                grossRevenueFulfilled: 1,
              },
            },
          ],

          // SALES SERIES (for chart)
          salesSeries: [
            {
              $group: {
                _id: {
                  bucketDate: {
                    $dateTrunc: {
                      date: "$createdAt",
                      unit,
                      timezone: "Asia/Dhaka",
                    },
                  },
                },
                orders: { $sum: 1 },
                grossRevenueAll: { $sum: "$effectiveOrderTotal" },
                totalDiscountAll: { $sum: "$_discountSafe" },
                grossRevenueFulfilled: {
                  $sum: {
                    $cond: [
                      { $in: ["$orderStatus", [...FULFILLED_STATUSES]] },
                      "$effectiveOrderTotal",
                      0,
                    ],
                  },
                },
              },
            },
            { $sort: { "_id.bucketDate": 1 as const } },
            {
              $project: {
                _id: 0,
                date: {
                  $dateToString: {
                    format,
                    date: "$_id.bucketDate",
                    timezone: "Asia/Dhaka",
                  },
                },
                orders: 1,
                grossRevenueAll: 1,
                totalDiscountAll: 1,
                netRevenueAll: { $subtract: ["$grossRevenueAll", "$totalDiscountAll"] },
                grossRevenueFulfilled: 1,
              },
            },
          ],

          // STATUS BREAKDOWN
          statusBreakdown: [
            {
              $group: {
                _id: "$orderStatus",
                orders: { $sum: 1 },
                grossRevenue: { $sum: "$effectiveOrderTotal" },
              },
            },
            { $project: { _id: 0, status: "$_id", orders: 1, grossRevenue: 1 } },
            { $sort: { orders: -1 as const } },
          ],
        },
      },
    ];

    const [result] = await SellModel.aggregate(pipeline);

    const cards = result?.cards?.[0] ?? {
      totalOrders: 0,
      pendingOrders: 0,
      pendingAmount: 0,
      grossRevenueAll: 0,
      totalDiscountAll: 0,
      netRevenueAll: 0,
      avgOrderValueAll: 0,
      grossRevenueFulfilled: 0,
    };

    return {
      cards,
      charts: {
        salesSeries: result?.salesSeries ?? [],
        statusBreakdown: result?.statusBreakdown ?? [],
      },
      range: { from: from.toISOString(), to: to.toISOString() },
      meta: { bucket: unit },
    };
  }



}
