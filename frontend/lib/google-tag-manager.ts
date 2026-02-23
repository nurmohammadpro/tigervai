
import { Product } from "@/@types/short-product";
import { CartItem } from "@/zustan-hook/cart";
import { sendGTMEvent } from "@next/third-parties/google";

type extra ={
    event_id: string,
    userId: string | undefined,
    userName: string | undefined,
    email: string | undefined,
}
export const viewcontentEvent = (payload: Product & extra) => {
    console.log("sending-payload-for-product-view",payload)
  return sendGTMEvent({
    event: "view_item",
    event_id: payload._id,
    user_data: {
      user_id: payload?.userId,
      name: payload?.userName,
      email: payload?.email,
    },
    ecommerce: {
      currency: "BDT",
      value:  payload.offerPrice ?? payload.price,
      items: [
        {
          item_id: payload.slug ?? payload._id,
          item_name: payload.name,
          item_brand: payload.brandName,
          item_category: payload.category,
          item_category2: payload.subMain,
          price: payload.hasOffer ? payload.offerPrice : payload.price,
          quantity: 1,
        },
      ],
    },
  });
};


export const addToCartEvent = (payload:CartItem & extra) => {
    console.log("sending-payload-for-add-to-cart",payload)
  return sendGTMEvent({
    event: "add_to_cart",
    event_id: payload.event_id,
    user_data: {
      user_id: payload.userId,
      name: payload.userName,
      email: payload.email,
    },
    ecommerce: {
      currency: "BDT",
      value: payload.unitPrice, // correct price
      items: [
        {
          item_id:payload.slug ?? payload.productId  ,
          item_name: payload.name,
          item_brand: payload.brandName,
          item_variant: `${payload.variant.size} / ${payload.variant.color}`,
          price: payload.unitPrice,
          quantity: payload?.quantity ?? 1,
        description:"tiger-vai-product",
          item_category: "product", // optional but GA4 likes it
        },
      ],
    },
  });
};

export interface BeginCheckoutPayload {
  event_id: string;

  userId?: string;
  userName?: string;
  email?: string;

  // GTM accepts an array of items
  items: CartItem[];
}

export const initiateCheckoutEvent = (payload: BeginCheckoutPayload) => {
    console.log("sending-payload-for-checkout",payload)
  return sendGTMEvent( {
    event: "begin_checkout",
    event_id: payload.event_id,

    user_data: {
      user_id: payload.userId,
      name: payload.userName,
      email: payload.email,
    },
    ecommerce: {
      currency: "BDT",
      value: payload.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
      items: payload.items,
    },
  });
};


export const purchaseEvent = (payload: {
  event_id: string ;
  userId: string | undefined;
  userName: string | undefined;
  email: string | undefined;

  orderTotal: number;
  totalDiscount: number;

  products: Array<{
    productId: string;
    slug: string;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    discountApplied?: number;
    variant: {
      size: string;
      color: string;
      price: number;
      discountPrice?: number;
      sku?: string;
    };
  }>;
}) => {
    console.log("sending-payload-for-purchase",payload)
  return sendGTMEvent({
    event: "purchase",

    event_id: payload.event_id, // your order ID
    user_data: {
      user_id: payload.userId,
      name: payload.userName,
      email: payload.email,
    },

    ecommerce: {
      transaction_id: payload.orderId,
      currency: "BDT",
      value: payload.orderTotal, // Total order value
      discount: payload.totalDiscount,

      items: payload.products.map((p) => ({
        item_id: p.productId,
        item_name: p.name,
        item_brand: p.slug, // optional; brandName not available
        item_variant: `${p.variant.size} / ${p.variant.color}`,
        price: p.unitPrice,
        quantity: p.quantity,

        item_category: "product",
        ...(p.variant.sku && { item_sku: p.variant.sku }),
      })),
    },
  });
};

export const pageViewEvent = (payload) => {
  return sendGTMEvent({
    event:"page_view", 
    event_id: payload.event_id,
    page_location: payload.url,
    page_title: payload.page_title,
  });
};
