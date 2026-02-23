import { Badge } from "@/components/ui/badge";

import { ProductCard } from "../navbar/common/CommonCard";

import { ProductCardSkeleton } from "../navbar/common/ProductCardSkeleton";
import { getBestProduct } from "@/actions/product";

const TodayBestSell = async () => {
  /*  const { data, isPending } = useQueryWrapper<ProductApiResponse>(
    ["get-normal-products"],
    `/product/search?page=1&limit=10`
  );
 */
  const { data } = await getBestProduct();
  return (
    <section id="feature" className="bg-gray-50 py-16">
      <div className="container mx-auto px-3 md:px-0 ">
        <div className="flex justify-between items-center mb-8">
          <h2 className=" text-2xl md:text-3xl font-bold text-palette-text">
            Today's Best Deals
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1">
          {!data
            ? // Show skeletons while loading
              Array.from({ length: 8 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))
            : // Show actual products
              data?.data?.map((product, index) => (
                <ProductCard
                  key={product._id || index}
                  product={product}
                  variant="default"
                />
              ))}
        </div>
      </div>
    </section>
  );
};

export default TodayBestSell;
