"use client";

import React, { useState } from "react";
import {
  User,
  LogOut,
  LayoutDashboard,
  Settings,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { BasicUser } from "@/@types/userType";
import { useRouter } from "next/navigation";
import { logOut } from "@/actions/auth";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQueryClient } from "@tanstack/react-query";
// import useProfilePopStore from "@/zustan-hook/profile-pop"; // REMOVED: Global state caused conflict

interface UserProfileDropdownProps {
  user: BasicUser | null;
}

export const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({
  user,
}) => {
  const router = useRouter();
  // CHANGED: Use local state instead of global store to prevent conflicts
  const [open, setOpen] = useState(false);
  const query = useQueryClient();
  const onLoginClick = () => {
    router.push("/auth/login");
  };

  const onLogout = async () => {
    await logOut();
    setOpen(false); // Close dropdown after logout
    query.refetchQueries({ queryKey: ["user-info"], exact: false });
  };

  const pushRouter = (path: string) => {
    router.push(path);
    setOpen(false);
  };

  if (!user) {
    return (
      <button
        onClick={onLoginClick}
        className="flex items-center gap-1 sm:gap-2 bg-[var(--palette-btn)] px-2.5 md:px-4 py-2 text-xs md:text-sm rounded-lg font-medium text-white transition-all hover:shadow-lg hover:-translate-y-0.5"
      >
        <User className=" size-3.5 sm:size-4" />
        Login
      </button>
    );
  }

  // Get user initials
  const getInitials = (name: string) => {
    return name
      ?.split(" ")
      ?.map((n) => n[0])
      ?.join("")
      ?.toUpperCase()
      ?.slice(0, 2);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="flex items-center text-xs justify-center w-9 h-9 rounded-full font-semibold text-white transition-all hover:shadow-md hover:scale-105 focus:outline-none ring-2 ring-offset-1 ring-transparent focus:ring-[var(--palette-btn)]"
          style={{ backgroundColor: "var(--palette-btn)" }}
          title={user?.name}
        >
          {getInitials(user?.name)}
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-80 p-0 rounded-xl shadow-xl border-0 z-[60]"
        align="end"
        style={{
          backgroundColor: "#ffffff", // Ensure solid background
          color: "var(--palette-text)",
        }}
      >
        {/* Header Section */}
        <div className="px-6 py-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center font-semibold text-white text-lg shadow-md shrink-0"
              style={{ backgroundColor: "var(--palette-btn)" }}
            >
              {getInitials(user.name)}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-base capitalize truncate text-gray-900">
                {user.name}
              </p>
              <p className="text-sm truncate text-gray-500">{user.email}</p>

              {/* Role Badge */}
              <span
                className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold mt-2"
                style={{
                  backgroundColor:
                    user.role === "vendor"
                      ? "rgba(240, 212, 168, 0.2)"
                      : user.role === "admin"
                        ? "rgba(255, 107, 122, 0.1)"
                        : "rgba(168, 179, 191, 0.2)",
                  color:
                    user.role === "vendor"
                      ? "var(--palette-accent-1, #d97706)"
                      : user.role === "admin"
                        ? "red"
                        : "gray",
                }}
              >
                {user?.role?.charAt(0)?.toUpperCase() + user?.role?.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Vendor Info (if vendor) */}
        {user?.role === "vendor" && user.shopName && (
          <div className="px-6 py-4 border-b border-gray-100">
            <p className="text-xs font-semibold mb-2 uppercase tracking-wide text-gray-500">
              Your Shop
            </p>
            <p className="font-medium text-sm text-gray-800">{user.shopName}</p>
            {user.shopAddress && (
              <p className="text-xs mt-1 text-gray-500">{user.shopAddress}</p>
            )}
          </div>
        )}

        {/* Menu Items */}
        <div className="px-3 py-3 space-y-1">
          <button
            onClick={() =>
              pushRouter(
                user.role === "vendor"
                  ? "/admin"
                  : user.role === "admin"
                    ? "/admin"
                    : "/user/profile",
              )
            }
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-gray-50 group"
          >
            <LayoutDashboard
              size={18}
              className="text-gray-500 group-hover:text-[var(--palette-btn)]"
            />
            <span className="font-medium text-sm text-gray-700 group-hover:text-[var(--palette-btn)]">
              Dashboard
            </span>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-red-50 group mt-2"
          >
            <LogOut
              size={18}
              className="text-gray-500 group-hover:text-red-500"
            />
            <span className="font-medium text-sm text-gray-700 group-hover:text-red-500">
              Logout
            </span>
          </button>
        </div>

        {/* Footer Info */}
        <div className="px-6 py-3 border-t border-gray-100 text-xs text-center text-gray-400">
          Last login: {new Date().toLocaleDateString()}
        </div>
      </PopoverContent>
    </Popover>
  );
};
