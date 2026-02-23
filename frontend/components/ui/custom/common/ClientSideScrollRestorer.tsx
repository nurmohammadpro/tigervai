"use client";
import { useEffect } from "react";

const ClientSideScrollRestorer = () => {
  useEffect(() => {
    // Simple scroll to top on route change
    window.scrollTo(0, 0);
  }, []);
  return <></>;
};
export default ClientSideScrollRestorer;
