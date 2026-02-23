"use client";
import { cn } from "@/lib/utils";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";
import Image from "next/image";
import facebook from "@/app/assets/facebook.png";
import instagram from "@/app/assets/instagram.png";
import tiktok from "@/app/assets/tiktok.png";
import youtube from "@/app/assets/youtube.png";

const Footer = () => {
  const pathName = usePathname();
  const Logos = [
    {
      icon: facebook.src,
    },
    {
      icon: instagram.src,
    },
    {
      icon: tiktok.src,
    },
    {
      icon: youtube.src,
    },
  ];

  return (
    <footer
      id="FOOTER"
      className={cn("bg-palette-text text-gray-300", {
        hidden: pathName.includes("/admin") || pathName.includes("/user"),
      })}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-8 lg:py-10">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
            {/* Company Info - Takes full width on mobile with 2 cols */}
            <div className="col-span-2 lg:col-span-1">
              <div className="mb-3">
                <Image
                  src={"/logo-black.avif"}
                  width={200}
                  height={100}
                  alt="Tiger vai logo"
                  className="h-auto"
                />
              </div>
              <p className="text-sm text-gray-400 mb-3 leading-relaxed">
                Bangladesh's most trusted multi-vendor e-commerce platform. Shop
                with confidence from thousands of verified sellers across the
                country.
              </p>
              <p className="text-xs text-gray-500 mb-3">
                Connecting buyers and sellers nationwide with secure payments,
                fast delivery, and excellent customer service.
              </p>
              <div className="flex gap-3 ">
                {Logos?.map((logo, idx) => (
                  <Image
                    src={logo.icon}
                    width={50}
                    height={50}
                    alt="logo"
                    key={idx}
                    className=" w-10 aspect-square"
                  />
                ))}
              </div>
            </div>

            {/* Customer Care */}
            <div>
              <h3 className="text-white font-semibold text-base mb-3">
                Customer Care
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-palette-btn transition-colors duration-200"
                  >
                    Buy And Sell
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-palette-btn transition-colors duration-200"
                  >
                    Track Order
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-palette-btn transition-colors duration-200"
                  >
                    Returns & Refunds
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-palette-btn transition-colors duration-200"
                  >
                    Help Center:{" "}
                    <span className=" text-palette-btn">+8801903-961752</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-palette-btn transition-colors duration-200"
                  >
                    Email:{" "}
                    <span className=" text-palette-btn">
                      tigerbhaioffice@gmail.com
                    </span>
                  </a>
                </li>
              </ul>
              {/* Contact */}
              <div>
                <div className="mt-2  border-gray-700">
                  <p className="text-xs text-gray-500 mb-1">Customer Service</p>

                  <p className="text-xs text-gray-400 mt-1">
                    Available 10 Am to 8 Pm
                  </p>
                </div>
              </div>
            </div>

            {/* About */}
            <div>
              <h3 className="text-white font-semibold text-base mb-3">About</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-palette-btn transition-colors duration-200"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-palette-btn transition-colors duration-200"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-palette-btn transition-colors duration-200"
                  >
                    Vendor Login
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-palette-btn transition-colors duration-200"
                  >
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-palette-btn transition-colors duration-200"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-700">
          <div className="py-4 text-center">
            <p className="text-sm text-gray-400">
              © 2025 Tiger Bhai. All Rights Reserved. | Built for Bangladesh
              with ❤️
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
