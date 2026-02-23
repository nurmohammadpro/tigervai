"use client";
import ChatApp from "@/components/ui/custom/chat-ui/ChatApp";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense>
      <ChatApp />
    </Suspense>
  );
};

export default page;
