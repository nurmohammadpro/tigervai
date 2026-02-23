import CartPage from "@/components/ui/custom/Cart/CartContent";
import React, { Suspense } from "react";
export const dynamic = "force-dynamic";
const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CartPage />
    </Suspense>
  );
};

export default page;
