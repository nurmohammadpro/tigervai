import {
  Zap,
  ChevronRight,
  Facebook,
  Instagram,
  Twitter,
  ShoppingBag,
  Star,
  Truck,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TodayBestSell from "@/components/ui/custom/home/TodayBestSell";
import TopBrand from "@/components/ui/custom/home/TopBrand";
import CategoryShop from "@/components/ui/custom/home/CategoryShop";
import HeroSection from "@/components/ui/custom/home/HeroSection";

const Page = () => {
  const categories = [
    { name: "Electronics", icon: "📱" },
    { name: "Women's Fashion", icon: "👗" },
    { name: "Men's Fashion", icon: "👔" },
    { name: "Watches", icon: "⌚" },
    { name: "Mobiles", icon: "📲" },
    { name: "Home & Kitchen", icon: "🏠" },
    { name: "Beauty", icon: "💄" },
    { name: "Baby Care", icon: "👶" },
  ];

  const dealsProducts = [
    {
      id: 1,
      name: "Modern Laptop",
      price: 55990,
      originalPrice: 79990,
      discount: 30,
      image: "🖥️",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 2499,
      originalPrice: 4999,
      discount: 50,
      image: "⌚",
      rating: 4.6,
    },
    {
      id: 3,
      name: "Running Shoes",
      price: 1499,
      originalPrice: 2999,
      discount: 50,
      image: "👟",
      rating: 4.7,
    },
    {
      id: 4,
      name: "Wireless Headphones",
      price: 1199,
      originalPrice: 1999,
      discount: 40,
      image: "🎧",
      rating: 4.9,
    },
    {
      id: 5,
      name: "Latest Smartphone",
      price: 18500,
      originalPrice: 21999,
      discount: 16,
      image: "📱",
      rating: 4.8,
    },
  ];

  const featuredProducts = [
    { id: 1, name: "Designer Watch", price: 3500, image: "⌚", rating: 4.8 },
    {
      id: 2,
      name: "Vision Rice Cooker",
      price: 2800,
      image: "🍚",
      rating: 4.5,
    },
    {
      id: 3,
      name: "Professional Cricket Bat",
      price: 2100,
      image: "🏏",
      rating: 4.7,
    },
    {
      id: 4,
      name: "Genuine Leather Wallet",
      price: 950,
      image: "👜",
      rating: 4.9,
    },
    { id: 5, name: "Walton Air Cooler", price: 8750, image: "❄️", rating: 4.6 },
  ];

  const brands = [
    { name: "Samsung", logo: "SAMSUNG" },
    { name: "Walton", logo: "WALTON" },
    { name: "Apple", logo: "APPLE" },
    { name: "Apex", logo: "APEX" },
    { name: "Bata", logo: "BATA" },
    { name: "LG", logo: "LG" },
  ];

  return (
    <div className=" bg-palette-bg h-full">
      {/* ============ HERO SECTION ============ */}
      <HeroSection />

      {/* ============ PROMOTIONAL BANNERS ============ */}
      {/*  <section
        id="PROMOTIONAL"
        className=" container mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 pb-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-md hover:shadow-lg transition">
            <CardContent className="p-8">
              <div className="text-4xl mb-4">🎁</div>
              <h3 className="text-xl font-bold text-palette-text mb-2">
                Big Discount Week
              </h3>
              <p className="text-palette-text/70 text-sm mb-6">
                Unbeatable prices on your favorite items
              </p>
              <Button
                size="sm"
                className="bg-palette-btn hover:bg-palette-btn/90 text-white"
              >
                Shop Now
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-palette-text text-white border-0 shadow-md hover:shadow-lg transition">
            <CardContent className="p-8">
              <Badge className="mb-3 bg-palette-btn/80 border-0 text-white">
                SPECIAL OFFER
              </Badge>
              <h3 className="text-xl font-bold mb-2">Up to 60% Off</h3>
              <p className="text-gray-200 text-sm mb-6">
                Electronics & gadgets sale
              </p>
              <Button
                size="sm"
                className="bg-palette-btn hover:bg-palette-btn/90 text-white"
              >
                Explore
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition">
            <CardContent className="p-8">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-bold text-palette-text mb-2">
                Exclusive Deals
              </h3>
              <p className="text-palette-text/70 text-sm mb-6">
                Special offers for you
              </p>
              <Button
                size="sm"
                className="bg-palette-btn hover:bg-palette-btn/90 text-white"
              >
                View
              </Button>
            </CardContent>
          </Card>
        </div>
      </section> */}

      {/* ============ CATEGORIES ============ */}
      <CategoryShop />

      {/* ============ TODAY'S BEST DEALS ============ */}
      <TodayBestSell />

      {/* ============ TOP BRANDS ============ */}
      <TopBrand />

      {/* ============ FEATURED PRODUCTS ============ */}
      {/*    <section id="FEATURED" className="bg-gray-50 py-16">
        <div className=" container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-palette-text mb-8">
            Featured Products
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {featuredProducts.map((product) => (
              <Card
                key={product.id}
                className="border-0 shadow-md hover:shadow-lg transition"
              >
                <div className="bg-gray-100 aspect-square flex items-center justify-center text-5xl">
                  {product.image}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-palette-text mb-2 text-xs line-clamp-2">
                    {product.name}
                  </h3>

                  <p className="text-base font-bold text-palette-btn mt-3">
                    ৳{product.price.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      {/* ============ VENDOR CTA SECTION ============ */}
      <section id="VENDOR" className="bg-palette-text text-white pt-16">
        <div className=" container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-4">Become a Vendor</h2>
              <p className="text-gray-200 text-lg mb-6">
                Join thousands of sellers and grow your business online with us.
                Start selling today and reach millions of customers across
                Bangladesh.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-palette-btn rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>Easy product management</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-palette-btn rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>Secure payment processing</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-palette-btn rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>Available 10 Am to 8 Pm</span>
                </li>
              </ul>
              <Button
                size="lg"
                className="bg-palette-btn hover:bg-palette-btn/90 text-white font-semibold"
              >
                Register Here
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="text-9xl">📦</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
    </div>
  );
};

export default Page;
