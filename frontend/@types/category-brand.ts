export interface BrandResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: Brand[];
}

export interface Brand {
  _id: string;
  name: string;
  logoUrl: string;
  categories: string[];
  createdAt: string; // or Date
  updatedAt: string; // or Date
  __v: number;
  isTop: boolean;
}



export interface CategoryResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: Category[];
}

export interface Category {
  _id: string;
  name: string;
  sub: Sub[];
  logoUrl: string;
  isTop: boolean;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  __v: number;
}

export interface Sub {
  SubMain: string;
  subCategory: string[];
}

