"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="mb-8">
        <div className="w-12 h-12 bg-[#e23636] rounded-lg flex items-center justify-center">
          <span className="text-xl">🏪</span>
        </div>
        <p className="text-sm text-gray-600 mt-2">MarketplaceBD</p>
      </div>

      <Card className="w-full max-w-md border-2 border-gray-200">
        <CardContent className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-3">Forgot Your Password?</h1>
          <p className="text-gray-600 text-center text-sm mb-8">
            No problem. Enter your registered email or phone number below and we'll send you instructions to reset it.
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-gray-900 font-medium mb-2">Email or Phone Number</label>
              <Input type="text" placeholder="e.g., yourname@example.com" className="border-2 border-gray-200 h-11" />
            </div>

            <Button className="w-full bg-[#e23636] hover:bg-red-700 text-white h-12 font-semibold">
              Send Reset Link
            </Button>

            <div className="text-center">
              <Button variant="link" className="text-gray-600 p-0">
                ← Back to Login
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
