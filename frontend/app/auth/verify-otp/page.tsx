"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])

  const handleChange = (idx: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp]
      newOtp[idx] = value
      setOtp(newOtp)

      if (value && idx < 5) {
        const nextInput = document.getElementById(`otp-${idx + 1}`)
        nextInput?.focus()
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md border-2 border-gray-200">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
              <span className="text-3xl">🔒</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Account</h1>
            <p className="text-gray-600 text-sm">
              We've sent a 6-digit code to user***@email.com. Please enter it below to reset your password.
            </p>
          </div>

          <div className="space-y-6">
            {/* OTP Input */}
            <div>
              <div className="flex justify-center gap-3">
                {otp.map((digit, idx) => (
                  <Input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(idx, e.target.value)}
                    className={`w-12 h-12 text-center text-lg font-semibold border-2 ${
                      digit ? "border-gray-300" : "border-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Verify Button */}
            <Button className="w-full bg-[#e23636] hover:bg-red-700 text-white h-12 font-semibold">Verify</Button>

            {/* Resend */}
            <p className="text-center text-gray-600 text-sm">
              Didn't receive the code?{" "}
              <button className="text-[#e23636] font-semibold hover:underline">Resend OTP</button> (00:59)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
