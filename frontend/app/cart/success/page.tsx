import React, { Suspense } from "react";
import OrderSuccessPage from "./SuccessComponnet";

const page = () => {
  return (
    <Suspense>
      <OrderSuccessPage />
    </Suspense>
  );
};

export default page;
