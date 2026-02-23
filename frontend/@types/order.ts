export interface OrdersResponse {
  message: string;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: Order[];
}

export interface Order {
  _id: string;
  products: OrderProduct[];
  shipment: ShipmentDetails;
  userId: string;
  isAdmin: boolean;
  orderStatus: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  orderTotal: number;
  totalDiscount: number;
  createdAt: string;
  updatedAt: string;
  orderNumber: string;
  __v: number;
}

export interface OrderProduct {
  productId: string;
  slug: string;
  name: string;
  quantity: number;
  totalPrice: number;
  variant: ProductVariant;
  brandName: string;
  brandId: string;
  mainCategory: string;
  category: string;
  vendorId: string;
  vendorSlug: string;
  unitPrice: number;
  discountApplied: number;
}

export interface ProductVariant {
  size: string;
  color: string;
  price: number;
  discountPrice: number;
}

export interface ShipmentDetails {
  name: string;
  phone: string;
  house: string;
  paymentMethod: "COD" | "ONLINE" | string;
  comment?: string;
}
