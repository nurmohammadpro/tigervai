// components/PageBanner.tsx
import React from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Cart from "@/app/assets/cart.png";
import Image from "next/image";
import Car from "@/app/assets/car.png";
import Del from "@/app/assets/del.png";

interface BreadcrumbRoute {
  title: string;
  link: string;
}

interface PageBannerProps {
  title: string;
  routes?: BreadcrumbRoute[];
  backgroundImage?: string;
}

const PageBanner: React.FC<PageBannerProps> = ({
  title,
  routes = [],
  backgroundImage = "/page-title.png", // default background
}) => {
  return (
    <div
      className="relative w-full h-[50px] md:h-[100px] flex flex-col items-center justify-center bg-cover  bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {/* Optional overlay for better text readability */}
      <div className="absolute inset-0 bg-black/5" />

      {/* Content */}
      <div className="relative z-10 flex  items-center justify-center space-y-4 gap-1.5">
        <Image src={Cart.src} width={40} height={40} alt="cart" />
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          {title}
        </h1>
        <Image src={Car.src} width={40} height={40} alt="cart" />
        <Image
          src={Del.src}
          width={40}
          height={40}
          alt="cart"
          className=" -translate-y-2"
        />
      </div>
    </div>
  );
};

export default PageBanner;
