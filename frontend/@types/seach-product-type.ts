export interface ProductResponse {
  total: number;
  items: ProductItem[];
  facets: Facets;
  pagination: Pagination;
}

export interface ProductItem {
  id: string;
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
  stock: number;
  rating: number;
  createdAt: string; // timestamp as string in your example
  // ✅ Price range fields for consistent display
  minPrice: number;
  maxPrice: number;
  minOriginalPrice: number;
  maxOriginalPrice: number;
}

export interface Facets {
  brandName: Record<string, number>;
  category: Record<string, number>;
  hasOffer: Record<string, number>;
  main: Record<string, number>;
  rating: Record<string, number>;
}

export interface Pagination {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
