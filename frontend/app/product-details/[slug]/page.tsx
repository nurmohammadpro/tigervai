import { Metadata } from "next";
import { Product } from "@/@types/fullProduct";
import { GetRequestNormal } from "@/api-hook/api-hook";
import ProductPage from "@/components/ui/custom/productDetails/ProductPage";
import Script from "next/script";

// ✅ Generate dynamic metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const product = await GetRequestNormal<Product>(
      `/product/get-product?slug=${slug}`
    );

    if (!product) {
      return {
        title: "Product Not Found",
        description: "The product you're looking for could not be found.",
      };
    }

    const price = product.offerPrice || product.price;
    const title = `${product.name} - ৳${price.toLocaleString()} | ${
      product.brand.name
    }`;

    const description = product.description
      ? product.description.substring(0, 160)
      : `Buy ${product.name} from ${product.brand.name}. ${
          product.stock > 0 ? "In Stock" : "Out of Stock"
        }. Price: ৳${price.toLocaleString()}. ${
          product.hasOffer ? "Special Offer Available!" : ""
        }`;

    const keywords = [
      product.name,
      product.brand.name,
      product.category.category,
      product.category.main,
      product.category.subMain,
      ...(product.colors || []),
      product.hasOffer ? "on sale" : "",
      "buy online",
    ]
      .filter(Boolean)
      .join(", ");

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://tigerbhai.online";
    const productUrl = `${baseUrl}/product/${slug}`;
    const mainImage =
      product.thumbnail?.url ||
      product.images?.[0]?.url ||
      `${baseUrl}/default-product.jpg`;

    return {
      title,
      description,
      keywords,

      // ✅ Fixed: Use "website" instead of "product"
      openGraph: {
        title,
        description,
        url: productUrl,
        siteName: "Tiger vai",
        type: "website", // ✅ Changed from "product"
        images: [
          {
            url: mainImage,
            width: 1200,
            height: 630,
            alt: product.name,
          },
          ...(product.images?.slice(0, 3).map((img) => ({
            url: img.url,
            width: 800,
            height: 800,
            alt: product.name,
          })) || []),
        ],
      },

      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [mainImage],
      },

      alternates: {
        canonical: productUrl,
      },

      // ✅ Product-specific metadata goes here instead
      other: {
        "product:price:amount": String(price),
        "product:price:currency": "BDT",
        "product:availability": product.stock > 0 ? "in stock" : "out of stock",
        "product:brand": product.brand.name,
        "product:condition": "new",
        "og:type": "product", // ✅ Add as custom meta tag
        "og:price:amount": String(price),
        "og:price:currency": "BDT",
      },

      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Product | Your Store",
      description: "View product details and buy online.",
    };
  }
}

const ProductDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const product = await GetRequestNormal<Product>(
    `/product/get-product?slug=${slug}`,
    100
  );

  console.log("Product details:", product);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Product Not Found</h1>
        <p className="text-gray-600 mt-2">
          The product you're looking for doesn't exist.
        </p>
      </div>
    );
  }

  // ✅ Generate JSON-LD structured data for Google Rich Results
  const price = product.offerPrice || product.price;
  const rating = product.stats?.averageRating || 0;
  const reviewCount = product.stats?.totalReviews || 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: [
      product.thumbnail?.url,
      ...(product.images?.map((img) => img.url) || []),
    ].filter(Boolean),
    sku: product.variants?.[0]?.sku || product._id,
    brand: {
      "@type": "Brand",
      name: product.brand.name,
    },
    offers: {
      "@type": "Offer",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/product/${slug}`,
      priceCurrency: "BDT",
      price: price,
      priceValidUntil: product.offerExpiresAt || undefined,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      shippingDetails: product.freeShipping
        ? {
            "@type": "OfferShippingDetails",
            shippingRate: {
              "@type": "MonetaryAmount",
              value: 0,
              currency: "BDT",
            },
          }
        : undefined,
    },
    ...(reviewCount > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: rating,
        reviewCount: reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
    }),
    ...(product.category && {
      category: product.category.category,
    }),
    ...(product.colors &&
      product.colors.length > 0 && {
        color: product.colors,
      }),
    ...(product.weight && {
      weight: {
        "@type": "QuantitativeValue",
        value: product.weight,
      },
    }),
    ...(product.warrantyPeriod && {
      warranty: product.warrantyPeriod,
    }),
  };

  // Breadcrumb JSON-LD
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: process.env.NEXT_PUBLIC_BASE_URL,
      },
      ...(product.category.main
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: product.category.main,
              item: `${process.env.NEXT_PUBLIC_BASE_URL}/category/${product.category.main}`,
            },
          ]
        : []),
      ...(product.category.category
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: product.category.category,
              item: `${process.env.NEXT_PUBLIC_BASE_URL}/category/${product.category.category}`,
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: 4,
        name: product.name,
        item: `${process.env.NEXT_PUBLIC_BASE_URL}/product/${slug}`,
      },
    ],
  };

  return (
    <>
      {/* ✅ Add JSON-LD scripts for rich snippets */}
      <Script
        id="single-product"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Script
        id="single-product-script"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <ProductPage params={product} />
    </>
  );
};

export default ProductDetailsPage;
