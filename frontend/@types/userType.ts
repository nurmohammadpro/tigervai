import { UserRole } from "@/zustan-hook/signup-hook";

export type BasicUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  address?: string;

  // vendor only
  shopName?: string;
  shopLogo?: string;
  shopAddress?: string;
 
};


export interface UserResponse {
  message: string;
  data: UserData;
}

export interface UserData {
  _id: string;
  role: string;
  name: string;
  email: string;
  password: string;
  isDeleted: boolean;
  slug: string;
  createdAt: string;   // or Date if you convert it
  updatedAt: string;   // or Date if you convert it
  __v: number;
    shopName?: string;
  shopLogo?: string;
  shopAddress?: string;
 
}

