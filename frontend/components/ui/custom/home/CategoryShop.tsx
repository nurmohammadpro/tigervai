"use client";

import { CategoryResponse, Category } from "@/@types/category-brand";
import { useQueryWrapper } from "@/api-hook/react-query-wrapper";
import { useRouter } from "next/navigation";
import Image from "next/image";

const CategoryShop = () => {
  const router = useRouter();

  const { data, isLoading } = useQueryWrapper<CategoryResponse>(
    ["get-shop-category"],
    "/category",
    {},
    1000
  );

  const handleCategoryClick = (categoryName: string) => {
    router.push(`/search-product?main=${encodeURIComponent(categoryName)}`);
  };

  if (isLoading) {
    return (
      <div className="w-full px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-gray-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div className="w-full px-4 py-12 text-center">
        <p className="text-gray-500">No categories available</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-6 sm:py-8">
      <div className=" container mx-auto">
        <h2 className=" text-2xl md:text-3xl font-bold text-palette-text mb-6">
          Shop by category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {data.data.map((category: Category) => (
            <button
              key={category._id}
              onClick={() => handleCategoryClick(category.name)}
              className="group relative bg-white rounded-lg overflow-hidden hover:shadow-sm transition-shadow duration-200 cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative aspect-square w-full bg-gray-50">
                <Image
                  src={category.logoUrl}
                  alt={category.name}
                  width={256}
                  height={256}
                  className="object-cover group-hover:scale-105 transition-transform duration-200 w-full h-full"
                />
              </div>

              {/* Category Name */}
              <div className="px-2 py-3 text-center">
                <p className="text-sm sm:text-base font-medium text-gray-800 truncate">
                  {category.name}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryShop;
