// components/share-product-dialog.tsx
"use client";

import { useState, useRef } from "react";
import { Share2, Copy, Download, Check } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ShareProductDialogProps {
  productUrl?: string; // Optional: pass specific URL, defaults to current page
}

export function ShareProductDialog({ productUrl }: ShareProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  // Get the URL to share (either passed prop or current browser URL)
  const shareUrl =
    productUrl || (typeof window !== "undefined" ? window.location.href : "");

  // Copy URL to clipboard
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  // Download QR code as PNG
  const handleDownloadQR = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;

    try {
      // Convert canvas to data URL
      const dataURL = canvas.toDataURL("image/png");

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = `product-qr-code-${Date.now()}.png`;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to download QR code:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center justify-center w-12 h-12 border-2 border-gray-200 rounded-lg text-palette-text hover:border-palette-btn hover:bg-palette-btn/5 transition-colors">
          <Share2 className="w-5 h-5" />
        </button>
      </DialogTrigger>

      <DialogContent className="">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-palette-text">
            Share this product
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* URL Section */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-palette-text">
              Product URL
            </label>
            <div className="flex items-center gap-2">
              <Input
                value={shareUrl}
                readOnly
                className="flex-1 bg-gray-50 border-gray-200"
              />
              <Button
                onClick={handleCopyUrl}
                size="sm"
                variant="outline"
                className="flex items-center gap-2 border-gray-200 hover:bg-palette-btn/5"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-palette-text">
              QR Code
            </label>
            <div className="flex flex-col items-center gap-4">
              {/* QR Code Canvas */}
              <div
                ref={qrRef}
                className="p-4 bg-white border-2 border-gray-200 rounded-lg"
              >
                <QRCodeCanvas
                  value={shareUrl}
                  size={200}
                  level="H"
                  includeMargin={true}
                  bgColor="#ffffff"
                  fgColor="#000000"
                />
              </div>

              {/* Download Button */}
              <Button
                onClick={handleDownloadQR}
                className="w-full bg-palette-btn hover:bg-palette-btn/90 text-white flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download QR Code
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
