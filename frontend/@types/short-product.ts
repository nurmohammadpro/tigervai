export interface ProductVariant {
  size: string;
  color: string;
  price: number;
  discountPrice: number;
  stock: number;
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
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ProductApiResponse {

    success: boolean;
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    data: Product[];
  
}
