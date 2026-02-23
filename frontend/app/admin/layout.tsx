"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AdminSidebar } from "@/components/ui/custom/admin/AdminSidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // ✅ Fixed: Build path up to and including current index
  const getFullUrl = (index: number) => {
    const segments = pathname.split("/").filter(Boolean);
    // Slice from 0 to index+1 to include current segment
    const pathSegments = segments.slice(0, index + 1);
    return "/" + pathSegments.join("/");
  };

  // ✅ Get segments for display
  const pathSegments = pathname.split("/").filter(Boolean);

  // ✅ Capitalize and format segment names
  const formatSegment = (segment: string) => {
    return segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="@container">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              {/* Home */}
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>

              {/* Dynamic segments */}
              {pathSegments.map((segment, index) => {
                const isLast = index === pathSegments.length - 1;
                const href = getFullUrl(index);

                return (
                  <div key={segment + index} className="contents">
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem className="hidden md:block">
                      {isLast ? (
                        // ✅ Last item is not a link
                        <BreadcrumbPage>
                          {formatSegment(segment)}
                        </BreadcrumbPage>
                      ) : (
                        // ✅ Other items are links
                        <BreadcrumbLink href={href}>
                          {formatSegment(segment)}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </div>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
