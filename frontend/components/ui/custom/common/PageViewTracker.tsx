"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { pageViewEvent } from "@/lib/google-tag-manager";
import { v4 as uuidv4 } from "uuid";

export function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url =
      pathname +
      (searchParams?.toString() ? `?${searchParams.toString()}` : "");

    // Small delay to ensure document.title is updated
    const timer = setTimeout(() => {
      pageViewEvent({
        event_id: uuidv4(),
        url: url,
        page_title: document.title,
      });
    }, 0);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return null;
}
