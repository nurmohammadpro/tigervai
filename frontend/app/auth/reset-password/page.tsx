"use client"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [password, setPassword] = useState("")

  const requirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One number", met: /[0-9]/.test(password) },
    { label: "One special character", met: /[!@#$%^&*]/.test(password) },
  ]

  const strengthScore = requirements.filter((r) => r.met).length
  const strengthText =
    strengthScore <= 1 ? "Weak" : strengthScore <= 2 ? "Fair" : strengthScore <= 3 ? "Good" : "Strong"
  const strengthColor =
    strengthScore <= 1
      ? "bg-red-500"
      : strengthScore <= 2
        ? "bg-yellow-500"
        : strengthScore <= 3
          ? "bg-blue-500"
          : "bg-green-500"

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="mb-8">
        <div className="w-12 h-12 bg-[#e23636] rounded-lg flex items-center justify-center">
          <span className="text-xl">🏪</span>
        </div>
        <p className="text-sm text-gray-600 mt-2">Platform Logo</p>
      </div>

      <Card className="w-full max-w-md border-2 border-gray-200">
        <CardContent className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">Set a New Password</h1>
          <p className="text-gray-600 text-center text-sm mb-8">
            Your new password must be different from previously used passwords.
          </p>

          <div className="space-y-6">
            {/* New Password */}
            <div>
              <label className="block text-gray-900 font-medium mb-2">New Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-2 border-gray-200 pr-10"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Password Strength */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-gray-900">Password Strength:</p>
                <p
                  className={`text-sm font-semibold ${strengthColor === "bg-red-500" ? "text-red-500" : strengthColor === "bg-yellow-500" ? "text-yellow-500" : strengthColor === "bg-blue-500" ? "text-blue-500" : "text-green-500"}`}
                >
                  {strengthText}
                </p>
              </div>
              <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full ${strengthColor}`} style={{ width: `${(strengthScore / 4) * 100}%` }}></div>
              </div>
            </div>

            {/* Requirements */}
            <div className="space-y-2">
              {requirements.map((req, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      req.met ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                    }`}
                  >
                    {req.met ? "✓" : "✕"}
                  </div>
                  <span className={req.met ? "text-gray-600" : "text-gray-600"}>{req.label}</span>
                </div>
              ))}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-900 font-medium mb-2">Confirm New Password</label>
              <div className="relative">
                <Input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm your new password"
                  className="border-2 border-gray-200 pr-10"
                />
                <button
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                >
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
              <span className="text-red-600 text-sm">⊘</span>
              <p className="text-red-600 text-sm">Passwords do not match. Please try again.</p>
            </div>

            <Button className="w-full bg-[#e23636] hover:bg-red-700 text-white h-12 font-semibold">
              Reset Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
