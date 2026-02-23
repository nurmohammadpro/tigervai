import { parseAsString, parseAsInteger, parseAsBoolean } from "nuqs/server";
import { createSearchParamsCache } from "nuqs/server";

export const searchParamsCache = createSearchParamsCache({
  // Filters
  q: parseAsString,
  category: parseAsString,
  subMain: parseAsString,
  brandName: parseAsString,
  main: parseAsString,
  hasOffer: parseAsBoolean,
  minPrice: parseAsInteger,
  maxPrice: parseAsInteger,
  minRating: parseAsInteger,
  maxRating: parseAsInteger,
  
  // Sorting
  sortBy: parseAsString.withDefault("createdAt"),
  sortOrder: parseAsString.withDefault("desc"),
  
  // Pagination
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(20),

  
});

export type SearchParams = ReturnType<typeof searchParamsCache.parse>;

// Convert to URLSearchParams for backend
export function toBackendParams(params: SearchParams): URLSearchParams {
  const urlParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      urlParams.set(key, String(value));
    }
  });
  
  return urlParams;
}
