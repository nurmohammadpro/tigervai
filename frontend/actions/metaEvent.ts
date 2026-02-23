// lib/meta-tracking.ts (NO "use server" directive!)

// Helper function to send events to Meta API
async function trackMetaEvent(event_name: string, payload: Record<string, any>) {
  try {
    const response = await fetch("/api/meta-tracking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_name, ...payload }),
    });
    
    if (!response.ok) {
      console.error("Meta tracking failed:", await response.text());
    }
  } catch (error) {
    console.error("Meta tracking error:", error);
  }
}

// ✅ View Content Event
export function viewContentServerEvent(payload: any) {
  trackMetaEvent("ViewContent", {
    event_id: payload.event_id,
    userId: payload?.userId,
    userName: payload?.userName,
    email: payload?.email,
    url: payload?.url,
    currency: "BDT",
    value: payload.offerPrice ?? payload.price,
    items: [
      {
        item_id: payload.slug ?? payload._id,
        item_name: payload.name,
        item_brand: payload.brandName,
        item_category: payload.category,
        price: payload.hasOffer ? payload.offerPrice : payload.price,
        quantity: 1,
      },
    ],
  });
}

// ✅ Add to Cart Event
export function addToCartServerEvent(payload: any) {
  trackMetaEvent("AddToCart", {
    event_id: payload.event_id,
    userId: payload.userId,
    userName: payload.userName,
    email: payload.email,
    url: payload.url,
    currency: "BDT",
    value: payload.unitPrice,
    items: [
      {
        item_id: payload.slug ?? payload.productId,
        item_name: payload.name,
        item_brand: payload.brandName,
        item_variant: `${payload.variant.size} / ${payload.variant.color}`,
        price: payload.unitPrice,
        quantity: 1,
      },
    ],
  });
}

// ✅ Initiate Checkout Event
export function initiateCheckoutServerEvent(payload: {
  event_id: string;
  userId?: string;
  userName?: string;
  email?: string;
  url?: string;
  items: any[];
}) {
  const totalValue = payload.items.reduce(
    (sum, item) => sum + (item.unitPrice || 0) * (item.quantity || 1),
    0
  );

  trackMetaEvent("InitiateCheckout", {
    event_id: payload.event_id,
    userId: payload.userId,
    userName: payload.userName,
    email: payload.email,
    url: payload.url,
    currency: "BDT",
    value: totalValue,
    items: payload.items.map((item) => ({
      item_id: item.productId || item.slug,
      item_name: item.name,
      item_brand: item.brandName,
      price: item.unitPrice,
      quantity: item.quantity,
    })),
  });
}

// ✅ Purchase Event
export function purchaseServerEvent(payload: {
  event_id: string;
  userId?: string;
  userName?: string;
  email?: string;
  url?: string;
  orderTotal: number;
  totalDiscount: number;
  products: any[];
}) {
  trackMetaEvent("Purchase", {
    event_id: payload.event_id,
    userId: payload.userId,
    userName: payload.userName,
    email: payload.email,
    url: payload.url,
    transaction_id: payload.event_id,
    currency: "BDT",
    value: payload.orderTotal,
    items: payload.products.map((p) => ({
      item_id: p.productId,
      item_name: p.name,
      item_brand: p.slug,
      item_variant: `${p.variant.size} / ${p.variant.color}`,
      price: p.unitPrice,
      quantity: p.quantity,
    })),
  });
}

// ✅ Page View Event
export function pageViewServerEvent(payload: {
  event_id: string;
  userId?: string;
  userName?: string;
  email?: string;
  url: string;
  page_title?: string;
}) {
  trackMetaEvent("PageView", {
    event_id: payload.event_id,
    userId: payload.userId,
    userName: payload.userName,
    email: payload.email,
    url: payload.url,
    value: 0,
    currency: "BDT",
  });
}
