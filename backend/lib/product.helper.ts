// src/product/helpers/product.helper.ts
export class ProductHelper {
  /**
   * Calculate average price from variants
   */
  static calculateAveragePrice(variants: any[]): number {
    if (!variants || variants.length === 0) return 0;

    const totalPrice = variants.reduce((sum, variant) => sum + (variant.price || 0), 0);
    return Math.round(totalPrice / variants.length);
  }

  /**
   * Calculate average offer/discount price from variants
   */
  static calculateAverageOfferPrice(variants: any[]): number | undefined {
    if (!variants || variants.length === 0) return undefined;

    const variantsWithOffer = variants.filter(v => v.discountPrice);
    if (variantsWithOffer.length === 0) return undefined;

    const totalOfferPrice = variantsWithOffer.reduce((sum, variant) => sum + variant.discountPrice, 0);
    return Math.round(totalOfferPrice / variantsWithOffer.length);
  }

  /**
   * Calculate total stock from all variants
   */
  static calculateTotalStock(variants: any[]): number {
    if (!variants || variants.length === 0) return 0;

    return variants.reduce((sum, variant) => sum + (variant.stock || 0), 0);
  }

  /**
   * Automatically determine hasOffer based on offerPrice
   * Returns true if offerPrice exists, is greater than 0, and is less than price
   */
  static calculateHasOffer(price: number, offerPrice?: number): boolean {
    if (!offerPrice || offerPrice <= 0) return false;
    if (!price || price <= 0) return false;
    return offerPrice < price;
  }

  /**
   * Calculate price range from variants for consistent display
   * Returns { minPrice, maxPrice, minOriginalPrice, maxOriginalPrice, hasDiscount }
   * Considers both variant-level discountPrice and product-level offerPrice
   */
  static calculatePriceRange(variants: any[], productPrice?: number, productOfferPrice?: number, productHasOffer?: boolean): {
    minPrice: number;
    maxPrice: number;
    minOriginalPrice: number;
    maxOriginalPrice: number;
    hasDiscount: boolean;
  } {
    if (!variants || variants.length === 0) {
      return {
        minPrice: productPrice || 0,
        maxPrice: productPrice || 0,
        minOriginalPrice: productPrice || 0,
        maxOriginalPrice: productPrice || 0,
        hasDiscount: !!productHasOffer && !!productOfferPrice && productOfferPrice < (productPrice || 0),
      };
    }

    // Calculate current price for each variant (considering variant discountPrice and product offerPrice)
    const currentPrices = variants.map(v => {
      // If variant has discountPrice, use it
      if (v.discountPrice && v.discountPrice > 0) {
        return v.discountPrice;
      }
      // If product has offerPrice, calculate proportional discount
      if (productHasOffer && productOfferPrice && productOfferPrice > 0 && productPrice && productPrice > 0) {
        const discountRatio = productOfferPrice / productPrice;
        return Math.round(v.price * discountRatio);
      }
      // No discount
      return v.price;
    });

    const originalPrices = variants.map(v => v.price);

    const minPrice = Math.min(...currentPrices);
    const maxPrice = Math.max(...currentPrices);
    const minOriginalPrice = Math.min(...originalPrices);
    const maxOriginalPrice = Math.max(...originalPrices);

    // Check if any variant has a discount
    const hasVariantDiscount = currentPrices.some((price, i) => price < originalPrices[i]);
    const hasProductOffer = !!productHasOffer && !!productOfferPrice && productOfferPrice > 0;
    const hasDiscount = hasVariantDiscount || hasProductOffer;

    return {
      minPrice,
      maxPrice,
      minOriginalPrice,
      maxOriginalPrice,
      hasDiscount,
    };
  }
}
