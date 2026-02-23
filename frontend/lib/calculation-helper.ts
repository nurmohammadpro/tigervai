/**
 * Calculate average price from variants
 */
export const calculateAveragePrice = (variants: any[]): number => {
  if (!variants || variants.length === 0) return 0;

  const totalPrice = variants.reduce(
    (sum, variant) => sum + (variant.price || 0),
    0
  );

  return Math.round(totalPrice / variants.length);
};

/**
 * Calculate average offer/discount price from variants
 */
export const calculateAverageOfferPrice = (
  variants: any[]
): number | undefined => {
  if (!variants || variants.length === 0) return undefined;

  const variantsWithOffer = variants.filter(v => v.discountPrice);

  if (variantsWithOffer.length === 0) return undefined;

  const totalOfferPrice = variantsWithOffer.reduce(
    (sum, variant) => sum + variant.discountPrice,
    0
  );

  return Math.round(totalOfferPrice / variantsWithOffer.length);
};

/**
 * Calculate total stock from all variants
 */
export const calculateTotalStock = (variants: any[]): number => {
  if (!variants || variants.length === 0) return 0;

  return variants.reduce(
    (sum, variant) => sum + (variant.stock || 0),
    0
  );
};
