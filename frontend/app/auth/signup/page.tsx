"use client";

import { useState } from "react";
import { Eye, EyeOff, ShoppingBag } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import axios from "axios";
import { CreateUserFormData, useAuthStore } from "@/zustan-hook/signup-hook";
import { PostRequestAxios } from "@/api-hook/api-hook";
import { toast } from "sonner";
import { SignUpUser } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import LoginWithGoogle from "@/components/ui/custom/common/googleLogin";

const SignUpPage = () => {
  const { formData, setFormData, resetForm, getCleanFormData } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  // Mutation
  const mutation = useMutation({
    mutationFn: (data: Partial<CreateUserFormData>) => SignUpUser(data),
    onSuccess: (data) => {
      console.log("Registration data:", data.error);
      if (data?.data) {
        resetForm();
        setConfirmPassword("");
        setAgreedToTerms(false);
        toast.success("Registration successful! Please log in.");
        router.push("/auth/login");
        return;
      }
      toast.error(data?.error?.message || "Registration failed");
      return;
    },
    onError: (error) => {
      console.error("Registration failed:", error);
      toast.error(error.message || "Registration failed");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(name as any, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!agreedToTerms) {
      toast.error("Passwords do not match");
      return;
    }
    const cleanData = getCleanFormData();
    mutation.mutate(cleanData);
  };

  return (
    <div className="min-h-screen bg-palette-bg flex flex-col justify-start">
      {/* Header */}
      {/*  <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <div className="w-11 h-11 bg-palette-btn rounded-lg flex items-center justify-center shadow-md">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-palette-text">MarketHub</span>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-2 md:py-8">
        <div className="w-full max-w-md bg-white rounded-xl p-8 shadow-lg border border-gray-100">
          <div className="text-center mb-3 md:mb-8">
            <h1 className="text-3xl font-bold text-palette-text mb-2">
              Create Your Account
            </h1>
            <p className="text-gray-600 text-sm">
              Join us and start shopping today!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-palette-text mb-2">
                Full Name
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full border-2 border-gray-200 h-11 focus:border-palette-btn focus:ring-palette-btn/10 transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-palette-text mb-2">
                Email Address
              </label>
              <Input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email or phone"
                className="w-full border-2 border-gray-200 h-11 focus:border-palette-btn focus:ring-palette-btn/10 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-palette-text mb-2">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className="w-full border-2 border-gray-200 h-11 pr-10 focus:border-palette-btn focus:ring-palette-btn/10 transition"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-palette-text mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full border-2 border-gray-200 h-11 pr-10 focus:border-palette-btn focus:ring-palette-btn/10 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-palette-text transition"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-3 py-3">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-5 h-5 mt-0.5 accent-palette-btn cursor-pointer border-2 border-gray-200 rounded"
              />
              <label
                htmlFor="terms"
                className="text-sm text-gray-700 leading-relaxed cursor-pointer"
              >
                I agree to the{" "}
                <a
                  href="#"
                  className="text-palette-btn font-semibold hover:underline transition"
                >
                  Terms & Conditions
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-palette-btn font-semibold hover:underline transition"
                >
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Sign Up Button */}
            <Button
              type="submit"
              disabled={!agreedToTerms || mutation.isPending}
              className="w-full bg-palette-btn hover:bg-palette-btn/90 text-white font-semibold h-11 rounded-lg mt-6 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mutation.isPending ? "Creating Account..." : "Sign Up"}
            </Button>

            {/* Error Message */}
            {mutation.isError && (
              <p className="text-red-500 text-sm text-center">
                {(mutation.error as any)?.response?.data?.message ||
                  "Registration failed"}
              </p>
            )}

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500 font-medium">
                  OR
                </span>
              </div>
            </div>

            {/* Social Sign Up */}
            {/*   <Button
              type="button"
              variant="outline"
              className="w-full border-2 border-gray-200 h-11 rounded-lg hover:border-palette-btn hover:bg-palette-bg transition font-medium text-palette-text bg-white"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign Up with Google
            </Button> */}
          </form>
          <Separator className=" my-6" />
          <LoginWithGoogle />
          {/* Sign In Link */}
          <p className="text-center text-gray-600 text-sm mt-6">
            Already have an account?{" "}
            <a
              href="/auth/login"
              className="text-palette-btn font-semibold hover:underline transition"
            >
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
