"use client";

import { useState } from "react";
import {
  Menu,
  Laptop,
  Shirt,
  Watch,
  Smartphone,
  Home as HomeIcon,
  Sparkles,
  Baby,
  Package,
  ChevronRight,
  ShoppingBag,
  X,
  House,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UserProfileDropdown } from "./common/UserProfileDropdown";
import CartSheet from "./CartSheet";
import { SearchModal } from "./SearchModal";
import { useQueryWrapper } from "@/api-hook/react-query-wrapper";
import { Category, CategoryResponse } from "@/@types/category-brand";
import Image from "next/image";
import { useUser } from "@/hooks/useUser";

// --- Configuration & Helpers ---

const ICON_MAP: Record<string, JSX.Element> = {
  Electronics: <Laptop className="w-5 h-5" />,
  "Mobiles & Tablets": <Smartphone className="w-5 h-5" />,
  Fashion: <Shirt className="w-5 h-5" />,
  "Home & Kitchen": <HomeIcon className="w-5 h-5" />,
  "Beauty & Health": <Sparkles className="w-5 h-5" />,
  "Watches & Jewelry": <Watch className="w-5 h-5" />,
  "Baby Products": <Baby className="w-5 h-5" />,
  "Sports & Outdoors": <Package className="w-5 h-5" />,
};

const getCategoryIcon = (categoryName: string) =>
  ICON_MAP[categoryName] ?? <Package className="w-5 h-5" />;

const QUICK_LINKS = [
  { label: "Deals", icon: Sparkles, href: "#" },
  { label: "Track", icon: Package, href: "#" },
  { label: "Gifts", icon: ShoppingBag, href: "#" },
];

const ClientNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const pathName = usePathname();
  const router = useRouter();

  const { data: user } = useUser();

  const { data: topCategories } = useQueryWrapper<Category[]>(
    ["get-mytop-category"],
    "/get-top-category",
    {},
    500
  );

  const { data: allCategory } = useQueryWrapper<CategoryResponse>(
    ["get-category"],
    "/category",
    {},
    500
  );

  const allCategories = allCategory?.data ?? [];

  // --- Sub-Components for cleaner render ---

  const CategoryIcon = ({ category }: { category: Category }) => (
    <div className="w-8 h-8 flex items-center justify-center shrink-0">
      {category.logoUrl ? (
        <img
          src={category.logoUrl}
          alt={category.name}
          className="w-6 h-6 object-contain"
        />
      ) : (
        getCategoryIcon(category.name)
      )}
    </div>
  );
  const handelToHome = () => {
    router.push("/");
  };

  return (
    <nav
      className={cn("sticky top-0 z-50 border-b shadow-sm  bg-white ", {
        hidden: pathName.includes("user") || pathName.includes("admin"),
      })}
      style={{ borderColor: "#e5e7eb" }}
    >
      <div className="container mx-auto px-4">
        {/* --- Desktop Header Layout --- */}
        <div className="hidden lg:flex justify-between items-center h-16">
          <div
            onClick={handelToHome}
            className=" flex flex-col  group justify-center items-center cursor-pointer"
          >
            <House className=" size-7 text-palette-btn  group-hover:text-palette-btn" />
            <span className=" text-xs md:text-sm font-semibold  group-hover:text-palette-btn duration-500">
              Home
            </span>
          </div>

          <Link href={"/"}>
            <div className="flex items-center gap-2 ">
              <Image
                src={"/logo-black.png"}
                width={180}
                height={100}
                alt="logo"
                priority
              />
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <SearchModal />
            <CartSheet />
            <UserProfileDropdown user={user} />
          </div>
        </div>

        {/* --- Mobile Header Layout --- */}
        <div className="lg:hidden flex flex-col pt-2 pb-1 md:py-3 gap-3">
          {/* Row 1: Logo + Actions */}
          <div className="flex justify-between items-center">
            <div
              onClick={handelToHome}
              className=" flex flex-col  group justify-center items-center cursor-pointer"
            >
              <House className=" size-7 text-palette-btn group-hover:text-palette-btn" />
              <span className=" text-xs md:text-sm font-semibold  group-hover:text-palette-btn duration-500">
                Home
              </span>
            </div>
            <Link
              className=" flex-1 flex justify-end sm:justify-center"
              href={"/"}
            >
              <Image
                src={"/logo-black.png"}
                width={160}
                height={70}
                alt="logo"
                priority
                className=""
              />
            </Link>
            <div className="flex items-center gap-3">
              <CartSheet />
              <UserProfileDropdown user={user} />
            </div>
          </div>

          {/* Row 2: Search + Menu Trigger */}
          <div className="flex items-center gap-3">
            <button
              className="p-2.5 rounded-lg active:scale-95 transition-transform border"
              onClick={() => setMobileMenuOpen(true)}
              style={{
                borderColor: "#e5e7eb",
                color: "var(--palette-text)",
              }}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <SearchModal />
            </div>
          </div>
        </div>

        {/* --- Desktop Navigation Bar (Categories) --- */}
        <div
          className="border-t py-3 hidden lg:flex items-center gap-4"
          style={{ borderColor: "#e5e7eb" }}
        >
          <Sheet open={categoryMenuOpen} onOpenChange={setCategoryMenuOpen}>
            <SheetTrigger asChild>
              <Button
                className="text-white shadow-sm hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "var(--palette-btn)" }}
              >
                <Menu className="w-4 h-4 mr-2" />
                View All Categories
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:max-w-[900px] p-0">
              <div className="flex h-full">
                {/* Left Sidebar - Categories List */}
                <div className="w-80 border-r overflow-y-auto bg-[#fafafa]">
                  <SheetHeader className="p-4 border-b bg-white">
                    <SheetTitle style={{ color: "var(--palette-text)" }}>
                      All Categories
                    </SheetTitle>
                  </SheetHeader>
                  <div className="p-2">
                    {allCategories.map((category) => (
                      <div
                        key={category._id}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all",
                          hoveredCategory === category.name &&
                            "bg-white shadow-sm"
                        )}
                        style={{
                          color:
                            hoveredCategory === category.name
                              ? "var(--palette-btn)"
                              : "var(--palette-text)",
                        }}
                        onMouseEnter={() => setHoveredCategory(category.name)}
                      >
                        <CategoryIcon category={category} />
                        <span className="flex-1 text-sm font-medium">
                          {category.name}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Content - Subcategories */}
                <div className="flex-1 overflow-y-auto bg-white p-6">
                  {hoveredCategory ? (
                    <div>
                      <h3 className="text-lg font-bold mb-4 pb-2 border-b text-[var(--palette-text)]">
                        Shop by Category
                      </h3>
                      <div className="space-y-6">
                        {allCategories
                          .find((cat) => cat.name === hoveredCategory)
                          ?.sub?.map((subcategory, index) => (
                            <div key={index}>
                              <h4 className="text-sm font-bold mb-3 text-[var(--palette-text)]">
                                {subcategory.SubMain}
                              </h4>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
                                {subcategory.subCategory?.map((item) => (
                                  <Link
                                    key={item}
                                    href={`/search-product?category=${item}`}
                                    onClick={() => setCategoryMenuOpen(false)}
                                    className="text-sm text-gray-600 hover:text-[var(--palette-btn)] transition-colors truncate"
                                  >
                                    • {item}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 flex-col">
                      <Package className="w-16 h-16 mb-4 opacity-50" />
                      <p className="text-lg">Hover over a category</p>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Top Categories Horizontal Menu */}
          <NavigationMenu>
            <NavigationMenuList>
              {topCategories?.slice(0, 6).map((category) => (
                <NavigationMenuItem key={category._id}>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-gray-100">
                    <div className="flex items-center gap-2">
                      {category.logoUrl ? (
                        <img
                          src={category.logoUrl}
                          alt={category.name}
                          className="w-4 h-4 object-contain"
                        />
                      ) : (
                        getCategoryIcon(category.name)
                      )}
                      <span>{category.name}</span>
                    </div>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {category.sub
                        ?.slice(0, 1)
                        .flatMap((sub) => sub.subCategory?.slice(0, 6) ?? [])
                        .map((item) => (
                          <li key={item}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={`/search-product?category=${item}`}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 hover:text-[var(--palette-btn)]"
                              >
                                <div className="text-sm font-medium leading-none">
                                  {item}
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>

      {/* --- MOBILE MENU (Simplified & Optimized) --- */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent
          side="left"
          className="w-[85%] sm:max-w-[400px] p-0 bg-white flex flex-col h-full"
        >
          <SheetHeader className="p-4 border-b shrink-0">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-left">
                <Image
                  src={"/logo-black.png"}
                  width={140}
                  height={60}
                  alt="logo"
                  className="object-contain"
                />
              </SheetTitle>
            </div>
          </SheetHeader>

          {/* Quick Links Row (Icons) */}
          {/*   <div className="grid grid-cols-3 border-b py-3 shrink-0 bg-gray-50/50">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex flex-col items-center justify-center gap-1 text-gray-600 hover:text-[var(--palette-btn)] transition-colors"
              >
                <div className="p-2 bg-white rounded-full border shadow-sm">
                  <link.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium">{link.label}</span>
              </Link>
            ))}
          </div> */}

          {/* Scrollable Category List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 pb-20">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">
                Browse Categories
              </p>

              <div className="space-y-1">
                {allCategories?.map((category) => (
                  <Sheet key={category._id}>
                    <SheetTrigger asChild>
                      <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors text-left border border-transparent hover:border-gray-100">
                        <span className="flex-1 font-medium text-gray-800">
                          {category.name}
                        </span>
                        <CategoryIcon category={category} />
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                      </button>
                    </SheetTrigger>

                    {/* Nested Subcategory Sheet */}
                    <SheetContent side="right" className="w-full p-0 bg-white">
                      <SheetHeader className="p-4 border-b flex-row items-center justify-between space-y-0">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              document.dispatchEvent(
                                new KeyboardEvent("keydown", { key: "Escape" })
                              )
                            }
                            className="mr-2 lg:hidden"
                          >
                            <ChevronRight className="w-5 h-5 rotate-180" />
                          </button>
                          <div className="flex items-center gap-2">
                            <CategoryIcon category={category} />
                            <SheetTitle className="text-base">
                              {category.name}
                            </SheetTitle>
                          </div>
                        </div>
                      </SheetHeader>
                      <div className="p-4 overflow-y-auto h-full pb-20 bg-gray-50/30">
                        {category.sub?.map((sub, i) => (
                          <div
                            key={i}
                            className="mb-5 bg-white p-4 rounded-xl border shadow-sm"
                          >
                            <h4 className="font-bold mb-3 text-[var(--palette-text)] text-sm border-b pb-2">
                              {sub.SubMain}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {sub.subCategory?.map((item) => (
                                <Link
                                  key={item}
                                  href={`/search-product?category=${item}`}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg text-sm border border-gray-100 hover:border-[var(--palette-btn)] hover:text-[var(--palette-btn)] transition-all"
                                >
                                  {item}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </SheetContent>
                  </Sheet>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Bottom Login/Register */}
          {!user && (
            <div className="p-4 border-t bg-white shrink-0">
              <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  className="w-full text-white h-11 font-semibold rounded-xl shadow-md shadow-orange-100"
                  style={{ backgroundColor: "var(--palette-btn)" }}
                >
                  Login / Register
                </Button>
              </Link>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default ClientNavbar;
