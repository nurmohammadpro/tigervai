export interface UserResponse {

  success: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: UserItem[];

}

export interface UserItem {
  _id: string;
  role: "user" | "admin" | "vendor";
  name: string;
  email: string;
  password: string;
  isDeleted: boolean;
  slug: string;
  createdAt: string;
  updatedAt: string;
  __v: number;

  // Optional fields depending on the user
  phone?: string;
  address?: string;
  shopName?: string;
  shopAddress?: string;
  shopLogo?: string;
  vendorDescription?: string;
}


