"use client";
import React, { useState } from "react";
import { FaWhatsapp, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const WhatsAppSupport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const pathName = usePathname();

  const whatsappNumber = "+8801234567890"; // Replace with your actual WhatsApp number
  const message = "Hello! I need support with my order.";

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div
      className={cn("fixed left-4 bottom-4 z-50", {
        hidden:
          pathName.startsWith("/admin") ||
          pathName.startsWith("/user") ||
          pathName.startsWith("/vendor") ||
          pathName.startsWith("/auth"),
      })}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mb-4 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 max-w-xs"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500 rounded-full   flex items-center justify-center ">
                  <FaWhatsapp className="text-white text-sm" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm">
                    Support Chat
                  </h4>
                  <p className="text-xs text-gray-500">
                    Support time: 10 AM - 8 PM
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes size={12} />
              </button>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 mb-3">
              <p className="text-sm text-gray-700">
                Need help ? Our support team is here to assist you!
              </p>
            </div>

            <button
              onClick={handleWhatsAppClick}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <FaWhatsapp size={16} />
              <span>Chat on WhatsApp</span>
            </button>

            <p className="text-xs text-gray-500 mt-2 text-center">
              Usually responds in minutes
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-1">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-label="Open WhatsApp Support"
          className="relative bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center overflow-visible"
        >
          <FaWhatsapp
            size={24}
            className="transform scale-x-[-1] -translate-x-0.5"
          />
          {/* Subtle pulse behind the icon */}
          <motion.div
            aria-hidden
            animate={{ scale: [1, 1.25, 1], opacity: [0.35, 0, 0.35] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="pointer-events-none absolute inset-0 rounded-full bg-green-500 -z-10"
          />
        </motion.button>

        {/* External label to the right of the icon */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="select-none cursor-pointer"
        >
          <span className="text-sm font-medium text-green-500">
            Support Chat
          </span>
          {/* Small arrow pointing to the icon */}
        </button>
      </div>
    </div>
  );
};

export default WhatsAppSupport;
