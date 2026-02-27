import { Suspense } from "react";
import { Metadata } from "next";
import { searchParamsCache, toBackendParams } from "@/lib/searchParams";
import { SearchParams } from "nuqs/server";
import { SearchClient } from "@/components/ui/custom/product-details/SearchResults";
import { GetRequestNormal } from "@/api-hook/api-hook";
import { ProductResponse } from "@/@types/seach-product-type";

async function fetchProducts(params: any) {
  const data = await GetRequestNormal<ProductResponse>(
    `/meilisearch/get-all-product?${toBackendParams(params)}`,
    60, // Revalidate every 60 seconds
    "products" // Cache tag for selective revalidation
  );
  return data;
}

// ✅ Generate dynamic metadata for SEO
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const params = searchParamsCache.parse(await searchParams);

  // Build dynamic title based on filters
  const titleParts: string[] = [];

  if (params.q) titleParts.push(params.q);
  if (params.category) titleParts.push(params.category);
  if (params.brandName) titleParts.push(params.brandName);
  if (params.main) titleParts.push(params.main);
  if (params.hasOffer) titleParts.push("On Sale");

  const title =
    titleParts.length > 0
      ? `${titleParts.join(" | ")} - Products | Tiger vai`
      : "Search Products | Tiger vai";

  // Build dynamic description
  const descParts: string[] = [];

  if (params.q) descParts.push(`Search results for "${params.q}"`);
  if (params.category) descParts.push(`in ${params.category} category`);
  if (params.brandName) descParts.push(`from ${params.brandName}`);
  if (params.minPrice || params.maxPrice) {
    const priceRange = `৳${params.minPrice || 0} - ৳${params.maxPrice || "∞"}`;
    descParts.push(`Price range: ${priceRange}`);
  }
  if (params.hasOffer) descParts.push("with special offers");

  const description =
    descParts.length > 0
      ? `${descParts.join(" ")}. Shop now and get the best deals!`
      : "Browse our wide selection of products. Find exactly what you're looking for with our advanced search and filters.";

  // Build canonical URL (without page param for SEO)
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://tigerbhai.online";
  const urlParams = new URLSearchParams();

  if (params.q) urlParams.set("q", params.q);
  if (params.category) urlParams.set("category", params.category);
  if (params.brandName) urlParams.set("brandName", params.brandName);
  if (params.main) urlParams.set("main", params.main);
  if (params.hasOffer) urlParams.set("hasOffer", "true");

  const canonicalUrl = urlParams.toString()
    ? `${baseUrl}/search?${urlParams.toString()}`
    : `${baseUrl}/search`;

  return {
    title,
    description,
    keywords: [
      params.q,
      params.category,
      params.brandName,
      params.main,
      "online shopping",
      "buy products online",
      "best deals",
    ]
      .filter(Boolean)
      .join(", "),

    // Open Graph for social media
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Your Store Name",
      type: "website",
      images: [
        {
          url: `${baseUrl}/og-image.jpg`, // Your default OG image
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/og-image.jpg`],
    },

    // Canonical URL (avoid duplicate content)
    alternates: {
      canonical: canonicalUrl,
    },

    // Robots
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
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = searchParamsCache.parse(await searchParams);
  const data = await fetchProducts(params);

  // ✅ Add JSON-LD structured data for rich snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    name: "Product Search Results",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/search`,
    numberOfItems: data?.total,
    itemListElement: data?.items
      .slice(0, 10)
      .map((product: any, index: number) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: product.name,
          image: product.thumbnail,
          offers: {
            "@type": "Offer",
            price: product.offerPrice || product.price,
            priceCurrency: "BDT",
            availability:
              product.stock > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
          },
        },
      })),
  };

  return (
    <>
      {/* ✅ Add JSON-LD script for structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-palette-bg">
        <div className="container mx-auto px-4 py-8">
          {/* ✅ Add H1 for SEO */}
          <h1 className="text-3xl font-bold text-palette-text mb-8">
            {params.q ? `Search: ${params.q}` : "All Products"}
            {params.category && ` - ${params.category}`}
            {params.brandName && ` - ${params.brandName}`}
          </h1>

          <Suspense
            fallback={
              <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-palette-btn"></div>
              </div>
            }
          >
            <SearchClient data={data} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
