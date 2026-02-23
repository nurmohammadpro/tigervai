export interface CreateSellResponse {
  message: string;
  summary: {
    totalOrderAmount: number;
    totalDiscount: number;
  };
  orderId: string;
  data: OrderData;

}

export interface OrderData {
  products: ProductItem[];
  orderTotal: number;
  totalDiscount: number;
  shipment: ShipmentInfo;
  orderType:string
}

export interface ProductItem {
  productId: string;
  slug: string;
  name: string;
  quantity: number;
  totalPrice: number;
  unitPrice: number;
  discountApplied: number;
  variant: ProductVariant;
  brandName: string;
  brandId: string;
  mainCategory: string;
  category: string;
  vendorId: string;
  vendorSlug: string;
}

export interface ProductVariant {
  size: string;
  color: string;
  price: number;
  discountPrice: number;
}

export interface ShipmentInfo {
  name: string;
  phone: string;
  house: string;
  paymentMethod: string;
  comment: string;
  thana: string;
  district: string;
}
