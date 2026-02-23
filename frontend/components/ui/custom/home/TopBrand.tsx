"use client";

import { useQueryWrapper } from "@/api-hook/react-query-wrapper";
import React from "react";
import { Marquee } from "@/components/ui/marquee";
import Image from "next/image";

export interface Brand {
  _id: string;
  name: string;
  logoUrl: string;
  categories: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  isTop: boolean;
}

const TopBrand = () => {
  const { data } = useQueryWrapper<Brand[]>(
    ["top-brand"],
    `/get-top-brand`,
    {},
    500
  );

  if (!data || data.length === 0) {
    return null;
  }
  const topData = [...data, ...data, ...data, ...data, ...data, ...data];

  return (
    <section className="py-12 w-full">
      <div className="container mx-auto px-4 mb-8">
        <div className="text-left">
          <h2
            className="text-2xl md:text-3xl font-bold mb-2"
            style={{ color: "var(--palette-text)" }}
          >
            Featured Brands
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            Shop from your favorite trusted brands
          </p>
        </div>
      </div>
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
        <Marquee pauseOnHover className="[--duration:20s] w-full">
          {topData?.map((brand, index) => (
            <div
              key={`${brand._id}`}
              className="mx-8 flex flex-col items-center justify-center group cursor-pointer"
            >
              <div className="w-32 h-24 md:w-40 md:h-32 flex items-center justify-center  transition-all duration-300">
                <Image
                  src={brand.logoUrl}
                  alt={brand.name}
                  className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                  loading="lazy"
                  width={200}
                  height={200}
                />
              </div>
              <p
                className="text-sm md:text-base font-medium mt-3 text-center"
                style={{ color: "var(--palette-text)" }}
              >
                {brand.name}
              </p>
            </div>
          ))}
        </Marquee>
        <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r"></div>
        <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l"></div>
      </div>
    </section>
  );
};

export default TopBrand;
