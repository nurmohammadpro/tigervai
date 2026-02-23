/* import { getUserInfo } from "@/actions/auth"; */
import ClientNavbar from "./Client-Navbar";
import { Suspense } from "react";
export const dynamic = "force-dynamic";
const Navbar = async () => {
  /*   let user = null;

  try {
    // ✅ Server-side fetch - always gets fresh data
    user = await getUserInfo();
  } catch (error) {
    console.error("Failed to fetch user:", error);
    user = null;
  } */

  return <ClientNavbar />;
};

export default Navbar;
