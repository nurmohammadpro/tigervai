// app/coming-soon/page.tsx
"use client";

import { useState } from "react";
import { Mail, Github, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ComingSoonPage() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNotifyMe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      console.log("Email subscribed:", email);
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-palette-accent-3/30 via-palette-bg to-palette-accent-1/20 flex items-center justify-center p-4">
      {/* Floating elements */}
      <div className="absolute top-20 left-10 text-6xl opacity-50 animate-bounce">
        🤖
      </div>
      <div className="absolute bottom-20 right-10 text-6xl opacity-50 animate-bounce delay-1000">
        🚀
      </div>
      <div className="absolute top-1/3 right-1/4 text-5xl opacity-40 animate-pulse">
        🌙
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-12 md:p-16 text-center">
        {/* Logo */}

        {/* Content */}
        <div className="space-y-6">
          {/* Badge */}
          <div className="text-sm font-semibold text-palette-text/70 uppercase tracking-widest">
            We're Still
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-bold text-palette-btn">
            Cooking Our Website.
          </h1>

          {/* Description */}
          <p className="text-palette-text/70 text-lg max-w-md mx-auto">
            We are going to launch our website Very Soon.
            <br />
            <span className="block mt-2">Stay Tune.</span>
          </p>

          {/* Notify Button */}

          {/* Success Message */}
          {isSubscribed && (
            <p className="text-sm text-green-600 font-medium">
              ✓ Thanks for subscribing! We'll notify you soon.
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="my-12 border-t border-gray-200"></div>

        {/* Social Links */}
        <div className="flex justify-center items-center gap-6">
          <a
            href="#"
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-palette-btn/10 flex items-center justify-center text-gray-600 hover:text-palette-btn transition"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="#"
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-palette-btn/10 flex items-center justify-center text-gray-600 hover:text-palette-btn transition"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href="#"
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-palette-btn/10 flex items-center justify-center text-gray-600 hover:text-palette-btn transition"
          >
            <Twitter className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
}
