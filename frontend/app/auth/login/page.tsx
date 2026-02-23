"use client";

import { Eye, EyeOff, ShoppingBag } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { useState } from "react";
import axios from "axios";
import { LoginFormData, useLoginStore } from "@/zustan-hook/login-hook";
import { loginUser } from "@/actions/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useProfilePopStore from "@/zustan-hook/profile-pop";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import LoginWithGoogle from "@/components/ui/custom/common/googleLogin";
export default function LoginPage() {
  const { formData, setFormData, resetForm, getCleanFormData } =
    useLoginStore();
  const [showPassword, setShowPassword] = useState(false);
  const { setOpen } = useProfilePopStore();
  const router = useRouter();
  // Mutation
  const mutation = useMutation({
    mutationFn: (data: Partial<LoginFormData>) =>
      loginUser(data?.email ?? "", data?.password ?? ""),
    onSuccess: (data) => {
      console.log("Login successful:", data);
      if (data?.data) {
        toast.success("Login successful!");
        resetForm();
        if (data?.data?.user?.role === "admin") {
          setOpen(false);

          return router.push("/admin/analytics");
        }
        if (data?.data?.user?.role === "user") {
          setOpen(false);
          return router.push("/user/profile");
        }
      }
      toast.error(data?.error?.message || "Login failed");

      // Redirect to dashboard or home
    },
    onError: (error) => {
      console.error("Login failed:", error);
      toast.error(error.message || "Login failed");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(name as any, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanData = getCleanFormData();
    console.log("cleanData", cleanData);
    mutation.mutate(cleanData);
  };

  return (
    <div className="min-h-screen bg-palette-bg flex flex-col items-center  justify-start sm:items-center sm:justify-center p-2 md:p-4">
      {/* Logo Section */}

      <Card className="w-full max-w-md border-0 shadow-lg">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-palette-text mb-1 md:mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600 text-sm">Log in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className=" space-y-2.5 md:space-y-5">
            {/* Email */}
            <div>
              <label className="block text-palette-text font-semibold mb-2">
                Email or Phone Number
              </label>
              <Input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email or phone"
                className="border-2 border-gray-200 h-11 focus:border-palette-btn focus:ring-palette-btn/10 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-palette-text font-semibold mb-2">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="border-2 border-gray-200 h-11 pr-10 focus:border-palette-btn focus:ring-palette-btn/10 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-palette-text transition"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Button
                variant="link"
                className="text-palette-btn hover:text-palette-btn/80 p-0 h-auto font-medium text-sm"
              >
                Forgot Password?
              </Button>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-palette-btn hover:bg-palette-btn/90 text-white h-12 font-semibold rounded-lg transition disabled:opacity-50"
            >
              {mutation.isPending ? "Logging in..." : "Login"}
            </Button>

            {/* Error Message */}
            {mutation.isError && (
              <p className="text-red-500 text-sm text-center">
                {(mutation.error as any)?.response?.data?.message ||
                  "Login failed"}
              </p>
            )}

            {/* Divider */}
            {/*  <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500 font-medium">
                  OR
                </span>
              </div>
            </div> */}

            {/* Social Login */}
            {/*     <Button
              type="button"
              variant="outline"
              className="w-full border-2 border-gray-200 h-11 bg-white hover:border-palette-btn hover:bg-palette-bg transition font-medium text-palette-text"
            >
              <span className="mr-2">🔍</span>
              Login with Google
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full border-2 border-gray-200 h-11 bg-white hover:border-palette-btn hover:bg-palette-bg transition font-medium text-palette-text"
            >
              <span className="mr-2">f</span>
              Login with Facebook
            </Button> */}

            {/* Sign Up */}
            <p className="text-center text-gray-600 text-sm pt-4">
              Don't have an account?{" "}
              <Link
                href={"/auth/signup"}
                className="text-palette-btn hover:text-palette-btn/80 p-0 h-auto font-semibold"
              >
                Sign Up
              </Link>
            </p>
          </form>
          <Separator className=" my-2 md:my-6" />
          <div className=" w-full flex justify-center-safe items-center-safe">
            <LoginWithGoogle />
          </div>
        </CardContent>
      </Card>

      {/* Footer Links */}
      <div className="mt-8 flex justify-center gap-6 text-gray-500 text-sm">
        <Button
          variant="link"
          className="text-gray-500 hover:text-palette-text p-0 h-auto transition"
        >
          Terms of Service
        </Button>
        <span className="text-gray-300">|</span>
        <Button
          variant="link"
          className="text-gray-500 hover:text-palette-text p-0 h-auto transition"
        >
          Privacy Policy
        </Button>
      </div>
    </div>
  );
}
