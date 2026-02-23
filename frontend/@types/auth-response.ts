export interface LoginResponse {
  message: string;
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface User {
  _id: string;
  role: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  shopName: string;
  shopLogo: string;
  shopAddress: string;
  vendorDescription: string;
  isDeleted: boolean;
  slug: string;
  createdAt: string;   // ISO date string
  updatedAt: string;   // ISO date string
  __v: number;
}
