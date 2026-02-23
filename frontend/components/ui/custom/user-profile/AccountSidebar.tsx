// components/AccountSidebar.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Package,
  MapPin,
  CreditCard,
  Heart,
  Bell,
  Lock,
  HelpCircle,
  LogOut,
  MessageSquare,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const accountMenuItems = [
  {
    title: "Account Information",
    url: "/user/profile",
    icon: User,
  },
  {
    title: "My Orders",
    url: "/user/order",
    icon: Package,
  },

  {
    title: "Payment Methods",
    url: "/user/payment",
    icon: CreditCard,
  },
  {
    title: "Wishlist",
    url: "/user/wishlist",
    icon: Heart,
  },
  {
    title: "Notifications",
    url: "/user/notifications",
    icon: Bell,
  },
  {
    title: "chat",
    url: "/user/chat",
    icon: MessageSquare,
  },

  {
    title: "Help & Support",
    url: "/user/help",
    icon: HelpCircle,
  },
];

export function AccountSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar {...props} className="bg-white border-r border-gray-200">
      {/* Header - User Profile */}
      <SidebarHeader className="border-b border-palette-accent-2/30 p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-palette-btn rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
            MR
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-palette-text text-sm">
              Masud Rana
            </h3>
            <p className="text-xs text-gray-600">masud@email.com</p>
          </div>
        </div>
      </SidebarHeader>

      {/* Menu Content */}
      <SidebarContent className="p-0">
        <SidebarMenu className="space-y-1 p-2">
          {accountMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.url;

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link
                    href={item.url}
                    className={cn("flex items-center gap-3 px-4 py-2 ", {
                      "bg-palette-btn/10 text-palette-text": isActive,
                    })}
                  >
                    <Icon className="w-5 h-5 " />
                    <span className="text-sm">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
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
