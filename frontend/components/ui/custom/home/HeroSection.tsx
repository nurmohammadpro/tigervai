"use client";
import React from "react";
import { ArrowRight, Store, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
const HeroSection = () => {
  const router = useRouter();
  const handelClick = () => {
    router.push("/search-product");
  };
  const handelPushToSeller = () => {
    toast.success("Under Development");
  };
  return (
    <section className="w-full bg-palette-bg py-16 md:py-32 min-h-[60vh] overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Left Column: Headings, Actions */}
          <div className="md:col-span-6 lg:col-span-5 flex flex-col gap-10">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight text-palette-text">
                Elevate Your Shopping&nbsp;
                <span className="text-palette-accent-1">With Top Sellers</span>
              </h1>
              <p className="mt-5 text-lg text-palette-text/80 font-normal max-w-xl">
                Discover thousands of products from trusted vendors.
                <br className="hidden md:block" />
                Secure payments, fast delivery, a new way to shop every day.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-palette-btn text-white hover:bg-palette-accent-1 rounded-full px-8 shadow"
                onClick={handelClick}
              >
                Browse Categories
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="rounded-full px-6 border border-palette-accent-1 text-palette-btn hover:bg-palette-accent-1/20"
                onClick={handelPushToSeller}
              >
                Become a Seller
                <UserPlus className="w-4 h-4 ml-2" />
              </Button>
            </div>
            {/* Vendor Trust/Stats */}
            {/*  <div className="flex gap-6 mt-10 text-sm font-medium">
              <div className="flex items-center gap-2 text-palette-accent-3">
                <Store className="w-4 h-4" />
                <span>1,250+ Shops</span>
              </div>
              <div className="flex items-center gap-2 text-palette-accent-2">
                <span className="w-2 h-2 bg-palette-accent-1 rounded-full block" />
                <span>97K+ Products</span>
              </div>
              <div className="flex items-center gap-2 text-palette-accent-2">
                <span className="w-2 h-2 bg-palette-accent-2 rounded-full block" />
                <span>Nationwide Delivery</span>
              </div>
            </div> */}
          </div>
          {/* Right Column: Visual */}
          <div className="md:col-span-6 lg:col-span-7 flex justify-center">
            <div className="aspect-[4/3] md:h-[480px] md:min-h-[380px] w-full rounded   flex items-center justify-center relative overflow-hidden ">
              <div className="flex flex-col items-center text-palette-accent-2">
                <Image
                  src={"/home-page.jpeg"}
                  width={500}
                  height={500}
                  className=" w-full h-full rounded"
                  alt="hero"
                />
              </div>
              {/* Featured Vendor Floating Card */}
              {/*    <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-sm p-4 rounded-xl  max-w-[220px] hidden sm:block">
                <p className="text-xs uppercase tracking-wider mb-1 text-palette-accent-1 font-semibold">
                  Featured Vendor
                </p>
                <p className="font-medium text-sm text-palette-text">
                  Modern Home Store
                </p>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
