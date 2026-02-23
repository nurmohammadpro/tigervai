export interface Root {
  
    cartProducts: CartProductWrapper[];
    totalPage: number;
  
}

export interface CartProductWrapper {
  _id: string;
  userId: string;
  cartProducts: CartItem[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CartItem {
  productId: Product;
  quantity: number;
}

export interface Product {
  _id: string;
  name: string;
  thumbnail: string;
  main: string;
  category: string;
  subMain: string;
  price: number;
  offerPrice: number;
  hasOffer: boolean;
  isDigital: boolean;
  brandId: string;
  brandName: string;
  slug: string;
  isAdminCreated: boolean;
  hotDeals: boolean;
  hotOffer: boolean;
  productOfTheDay: boolean;
  stock: number;
  vendorId: string;
  variants: Variant[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  isActive: boolean;
}

export interface Variant {
  size: string;
  color: string;
  price: number;
  discountPrice: number;
  stock: number;
}
