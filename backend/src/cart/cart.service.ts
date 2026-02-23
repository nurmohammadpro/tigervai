import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { TenantConnectionService } from 'lib/connection/mongooseConnection.service';
import { globalCart, globalProducts } from 'lib/global-db/globaldb';
import { Cart, CartDocument, CartSchema } from './entities/cart.entity';
import { Types } from 'mongoose';
import { ShortProduct, ShortProductDocument, ShortProductSchema } from 'src/product/entities/short-product.schema';
import { PaginationDto } from 'lib/pagination.dto';

@Injectable()
export class CartService {
  constructor(private tenantConnectionService: TenantConnectionService) {}

  private getCartModel() {
    return this.tenantConnectionService.getModel<CartDocument>(
      globalCart,
      Cart.name,
      CartSchema,
    );
  }
  private getShortProductModel() {
    return this.tenantConnectionService.getModel<ShortProductDocument>(
      globalProducts,
      ShortProduct.name,
      ShortProductSchema,
    );
  }
async create(userId: string, createCartDto: CreateCartDto) {
  const { productId, quantity } = createCartDto;
  const cartModel = this.getCartModel();
  let cart = await cartModel.findOne({ userId });

  // ✅ CART DOES NOT EXIST → CREATE IT
  if (!cart) {
    cart = await cartModel.create({
      userId,
      cartProducts: [{ productId, quantity }],
    });
    return { 
      cart, 
      action: 'added', 
      message: 'Product added to cart' 
    };
  }

  // ✅ CART EXISTS → Check if product exists
  const existingProductIndex = cart.cartProducts.findIndex(
    (p) => p.productId.toString() === productId,
  );

  if (existingProductIndex !== -1) {
    // ✅ Product EXISTS → REMOVE IT
    cart.cartProducts.splice(existingProductIndex, 1);
    
    await cart.save();
    return { 
      cart, 
      action: 'removed', 
      message: 'Product removed from cart' 
    };
  } else {
    // ✅ Product DOESN'T EXIST → ADD IT
    cart.cartProducts.push({
      productId: new Types.ObjectId(productId),
      quantity,
    });
    
    await cart.save();
    return { 
      cart, 
      action: 'added', 
      message: 'Product added to cart' 
    };
  }
}

  async removeFromCart(userId: string, productId: string) {
      const cartModel = this.getCartModel();
    const cart = await cartModel.findOne({ userId });

    if (!cart) throw new NotFoundException('Cart not found');

    cart.cartProducts = cart.cartProducts.filter(
      (p) => p.productId.toString() !== productId,
    );

    return cart.save();
  }
    async getCart(query:PaginationDto,userId: string) {
         const cartModel = this.getCartModel();
         const shortProductModel = this.getShortProductModel()
         const {page=1,limit=10} = query
         const count = await cartModel.countDocuments({userId})
    const cart = await cartModel
      .find({ userId }).skip((page-1)*limit).limit(limit)
      .populate({ path: 'cartProducts.productId' ,model:shortProductModel}).lean();

    if (!cart.length) {
      return {
      
        cartProducts: [],

        totalPage: Math.ceil(count / limit)
      };
    }

    return {
  
      cartProducts: cart,
      totalPage: Math.ceil(count / limit)
    };
  }
    async getCartList(userId: string) {
         const cartModel = this.getCartModel();
        
    const cart = await cartModel
      .findOne({ userId }).select("cartProducts").lean();
      

    if (!cart) {
      return {
      
        cartProducts: [],
      };
    }

    return cart;
  }

  findAll() {
    return `This action returns all cart`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
