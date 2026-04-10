"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <>
      {/* Mobile Toaster - positioned below navbar */}
      <div className="lg:hidden">
        <Sonner
          theme={theme as ToasterProps["theme"]}
          className="toaster group"
          position="top-center"
          icons={{
            success: <CircleCheckIcon className="size-4" />,
            info: <InfoIcon className="size-4" />,
            warning: <TriangleAlertIcon className="size-4" />,
            error: <OctagonXIcon className="size-4" />,
            loading: <Loader2Icon className="size-4 animate-spin" />,
          }}
          style={
            {
              "--normal-bg": "var(--popover)",
              "--normal-text": "var(--popover-foreground)",
              "--normal-border": "var(--border)",
              "--border-radius": "var(--radius)",
              "--toast-offset": "130px",
            } as React.CSSProperties
          }
          toastOptions={{
            className: "!top-[130px] !mt-4 animate-slide-down",
          }}
          {...props}
        />
      </div>

      {/* Desktop/Tablet Toaster - slide from right */}
      <div className="hidden lg:block">
        <Sonner
          theme={theme as ToasterProps["theme"]}
          className="toaster group"
          position="bottom-right"
          icons={{
            success: <CircleCheckIcon className="size-4" />,
            info: <InfoIcon className="size-4" />,
            warning: <TriangleAlertIcon className="size-4" />,
            error: <OctagonXIcon className="size-4" />,
            loading: <Loader2Icon className="size-4 animate-spin" />,
          }}
          style={
            {
              "--normal-bg": "var(--popover)",
              "--normal-text": "var(--popover-foreground)",
              "--normal-border": "var(--border)",
              "--border-radius": "var(--radius)",
            } as React.CSSProperties
          }
          toastOptions={{
            className: "!bottom-4 !top-auto !left-auto !right-4 animate-slide-in-right",
          }}
          {...props}
        />
      </div>
    </>
  )
}

export { Toaster }
