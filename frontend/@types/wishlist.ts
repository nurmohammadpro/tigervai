interface CartProduct {
  productId: string;
  quantity: number;
}

export interface CartData {
  _id: string;
  cartProducts: CartProduct[];
}
