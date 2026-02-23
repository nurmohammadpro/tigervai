export type Review = {
  _id: string;
  userId: {
    _id: string;
    name: string;
  };
  userName: string;
  productId: string;
  comment: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
type returnData ={
    data: Review[];
    totalPage: number;
  
}

export type Reviews = returnData;