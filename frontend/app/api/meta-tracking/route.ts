// app/api/meta-tracking/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const META_API_VERSION = "v19.0";

// ===================== HELPERS =====================

function hashSHA256(value: string | undefined) {
  if (!value) return undefined;
  const normalized = value.toString().trim().toLowerCase();
  return crypto.createHash("sha256").update(normalized).digest("hex");
}

function generateEventId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ===================== API HANDLER =====================

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { event_name, ...payload } = await request.json();

    const pixelId = process.env.META_PIXEL_ID;
    const accessToken = process.env.META_ACCESS_TOKEN;

    if (!pixelId || !accessToken) {
      console.error("❌ [META CAPI] Missing META_PIXEL_ID or META_ACCESS_TOKEN");
      return NextResponse.json(
        { success: false, error: "Missing Meta Pixel credentials" },
        { status: 500 }
      );
    }

    const clientIp =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      request.headers.get("cf-connecting-ip") ||
      "127.0.0.1";

    // ✅ Build user_data
    const userData: Record<string, any> = {
      client_ip_address: clientIp,
      client_user_agent: request.headers.get("user-agent"),
    };

    if (payload.userId) userData.external_id = hashSHA256(payload.userId);
    if (payload.email) userData.em = hashSHA256(payload.email);
    if (payload.userName && payload.userName !== "guest") {
      userData.fn = hashSHA256(payload.userName.split(" ")[0]);
      if (payload.userName.split(" ").length > 1) {
        userData.ln = hashSHA256(
          payload.userName.split(" ").slice(1).join(" ")
        );
      }
    }

    // ✅ Build custom_data
    const customData: Record<string, any> = {
      currency: payload.currency || "BDT",
      value: payload.value || 0,
    };

    if (payload.transaction_id || payload.orderId) {
      customData.transaction_id = payload.transaction_id || payload.orderId;
    }

    if (payload.items && Array.isArray(payload.items)) {
      customData.contents = payload.items.map((item: any) => ({
        id: item.item_id || item.productId,
        quantity: item.quantity || 1,
        item_price: item.price || item.unitPrice || 0,
        ...(item.item_name && { title: item.item_name }),
        ...(item.item_brand && { brand: item.item_brand }),
        ...(item.item_category && { category: item.item_category }),
      }));
      customData.content_type = "product";
      customData.num_items = payload.items.reduce(
        (sum: number, item: any) => sum + (item.quantity || 1),
        0
      );
    }

    const body = {
      data: [
        {
          event_name,
          event_time: Math.floor(Date.now() / 1000),
          event_id: payload.event_id || generateEventId(),
          action_source: "website",
          event_source_url: payload.url,
          user_data: userData,
          custom_data: customData,
        },
      ],
    };

    // ✅ Enhanced Logging
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`📤 [META CAPI] ${event_name}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🆔 Event ID:", body.data[0].event_id);
    console.log("👤 User Data:", {
      hasEmail: !!userData.em,
      hasUserId: !!userData.external_id,
      hasName: !!userData.fn,
      ip: clientIp.substring(0, 10) + "...",
    });
    console.log("💰 Custom Data:", {
      currency: customData.currency,
      value: customData.value,
      items: customData.contents?.length || 0,
      transaction_id: customData.transaction_id,
    });

    const res = await fetch(
      `https://graph.facebook.com/${META_API_VERSION}/${pixelId}/events?access_token=${accessToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const result = await res.json();
    const duration = Date.now() - startTime;

    if (!res.ok) {
      console.error("❌ [META CAPI] Error:", {
        status: res.status,
        error: result,
        duration: `${duration}ms`,
      });
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
      return NextResponse.json(
        { success: false, error: result },
        { status: res.status }
      );
    }

    console.log(`✅ [META CAPI] Success:`, {
      events_received: result.events_received,
      fbtrace_id: result.fbtrace_id,
      duration: `${duration}ms`,
    });
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    return NextResponse.json({ success: true, result });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error("❌ [META CAPI] Network Error:", {
      error: error instanceof Error ? error.message : error,
      duration: `${duration}ms`,
    });
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
