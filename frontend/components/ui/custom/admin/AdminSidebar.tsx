// components/AdminSidebar.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Package,
  Users,
  Store,
  Tag,
  Layers,
  ShoppingBag,
  TrendingUp,
  LogOut,
  Settings,
  MessageCircle,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const managementMenuItems = [
  {
    title: "Analytics",
    url: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Order Management",
    url: "/admin/order-management",
    icon: Package,
  },
  {
    title: "User Management",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "Vendor Management",
    url: "/admin/vendors",
    icon: Store,
  },
  {
    title: "Brand Management",
    url: "/admin/brand-page",
    icon: Tag,
  },
  {
    title: "Category Management",
    url: "/admin/category-page",
    icon: Layers,
  },
  {
    title: "Product Management",
    url: "/admin/products",
    icon: ShoppingBag,
  },
];

const personalMenuItems = [
  {
    title: "My Orders",
    url: "/admin/my-orders",
    icon: Package,
  },
  {
    title: "My Products",
    url: "/admin/my-products",
    icon: ShoppingBag,
  },
  {
    title: "My Sales",
    url: "/admin/my-sales",
    icon: TrendingUp,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
  {
    title: "chat",
    url: "/admin/chat",
    icon: MessageCircle,
  },
];

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar {...props} className="bg-white border-r border-gray-200">
      {/* Header - User Profile */}
      <SidebarHeader className="border-b border-palette-accent-2/30 p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-palette-btn rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
            AD
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-palette-text text-sm">
              Admin User
            </h3>
            <p className="text-xs text-gray-600">admin@email.com</p>
          </div>
        </div>
      </SidebarHeader>

      {/* Menu Content */}
      <SidebarContent className="p-0">
        {/* Management Section */}
        <div className="px-2 py-4">
          <p className="px-4 py-2 text-xs font-bold text-palette-btn uppercase tracking-wider">
            Management
          </p>
          <SidebarMenu className="space-y-1">
            {managementMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.url;

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2 text-palette-text/70 hover:text-palette-text hover:bg-palette-bg transition",
                        {
                          "bg-palette-btn/10 text-palette-btn": isActive,
                        }
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </div>

        {/* Divider */}
        <SidebarSeparator className="my-0 bg-palette-accent-2/30" />

        {/* Personal Section */}
        <div className="px-2 py-4">
          <p className="px-4 py-2 text-xs font-bold text-palette-btn uppercase tracking-wider">
            Personal
          </p>
          <SidebarMenu className="space-y-1">
            {personalMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.url;

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2 text-palette-text/70 hover:text-palette-text hover:bg-palette-bg transition",
                        {
                          "bg-palette-btn/10 text-palette-btn": isActive,
                        }
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </div>
      </SidebarContent>

      {/* Footer - Logout */}
      <div className="border-t border-gray-200 p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-palette-btn hover:bg-palette-btn/10 gap-3 h-10"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Logout</span>
        </Button>
      </div>

      <SidebarRail />
    </Sidebar>
  );
}
