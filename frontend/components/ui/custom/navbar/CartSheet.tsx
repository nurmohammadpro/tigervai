// components/cart/CartSheet.tsx
"use client";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/zustan-hook/cart";
import { getUserInfo } from "@/actions/auth";
import { initiateCheckoutEvent } from "@/lib/google-tag-manager";
import { initiateCheckoutServerEvent } from "@/actions/metaEvent";
import CartIcons from "@/app/assets/cart.png";
export default function CartSheet() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const {
    items,
    totalItems,
    totalPrice,
    totalDiscount,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
  } = useCartStore();

  const finalTotal = totalPrice - totalDiscount;

  const handleCheckout = async () => {
    setOpen(false);
    router.push("/cart/shipment");

    const eventId = uuidv4();
    const getUser = await getUserInfo();
    const extraData = {
      userId: getUser?.id,
      userName: getUser?.name,
      email: getUser?.email,
      event_id: eventId,
      items: items,
    };
    initiateCheckoutEvent(extraData);
    initiateCheckoutServerEvent(extraData);
  };
  const handelToCart = () => {
    setOpen(false);
    router.push("/cart");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className=" border-none" asChild>
        <Button
          variant="outline"
          className="relative shadow-none border-none border-0"
        >
          <Image src={CartIcons} alt="cart" width={25} height={25} />
          {/* <ShoppingCart className="w-4 h-4 mr-2" /> */}
          <span className=" sr-only">Cart ({totalItems})</span>

          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-palette-btn text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg flex flex-col p-0">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Shopping Cart ({totalItems} {totalItems === 1 ? "item" : "items"})
          </SheetTitle>
          <SheetDescription>Review your items before checkout</SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Your cart is empty
            </h3>
            <p className="text-sm text-gray-500 mb-4 text-center">
              Add some products to get started!
            </p>
            <Button onClick={() => setOpen(false)}>Continue Shopping</Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <ScrollArea className="flex-1 px-6">
              <div className="space-y-4 py-4">
                {items.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {/* Product Image */}
                    <Link
                      href={`/product/${item.slug}`}
                      onClick={() => setOpen(false)}
                      className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden"
                    >
                      <Image
                        src={item.thumbnail}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${item.slug}`}
                        onClick={() => setOpen(false)}
                        className="font-medium text-sm text-palette-text hover:text-palette-btn line-clamp-2"
                      >
                        {item.name}
                      </Link>

                      {/*  <p className="text-xs text-gray-500 mt-1">
                        {item.brandName}
                      </p> */}

                      {/* Variant Info */}
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                          {item.variant.color}
                        </span>
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                          {item.variant.size}
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-semibold text-palette-text">
                          TK {item.unitPrice.toFixed(2)}
                        </span>
                        {item.variant.discountPrice && (
                          <span className="text-xs text-gray-500 line-through">
                            TK {item.variant.price.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => decrementQuantity(item._id)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>

                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>

                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => incrementQuantity(item._id)}
                          disabled={item.quantity >= item.variantStock}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 ml-auto text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => removeFromCart(item._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Stock Warning */}
                      {item.quantity >= item.variantStock && (
                        <p className="text-xs text-amber-600 mt-1">
                          Max stock reached
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Footer with Totals */}
            <div className="border-t bg-gray-50 px-6 py-4 space-y-3">
              {/* Subtotal */}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">TK {totalPrice.toFixed(2)}</span>
              </div>

              {/* Checkout Button */}
              <div className=" w-full grid grid-cols-2  gap-1.5">
                <Button
                  size="lg"
                  className=" bg-palette-btn/90 hover:bg-palette-btn"
                  onClick={handleCheckout}
                >
                  Checkout
                </Button>

                <Button variant="outline" onClick={handelToCart}>
                  Cart
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
