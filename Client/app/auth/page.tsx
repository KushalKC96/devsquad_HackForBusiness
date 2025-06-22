"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"

export default function AuthPage() {
  const { t } = useLanguage()
  const { login, register } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mode, setMode] = useState<"signin" | "signup">("signin")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    agreeTerms: false,
  })

  useEffect(() => {
    const modeParam = searchParams.get("mode")
    if (modeParam === "signup" || modeParam === "signin") {
      setMode(modeParam)
    }  }, [searchParams])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error and success messages when user starts typing
    if (error) {
      setError("")
    }
    if (successMessage) {
      setSuccessMessage("")    }
  }

  const switchMode = (newMode: "signin" | "signup") => {
    setMode(newMode)
    setError("")
    setSuccessMessage("")
    // Clear form data when switching modes
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      agreeTerms: false,
    })
    // Reset password visibility
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccessMessage("")

    try {
      if (mode === "signup") {
        // Validate signup form
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match!")
          return
        }
        if (!formData.agreeTerms) {
          setError("Please agree to the terms and conditions!")
          return
        }
        if (!formData.firstName.trim() || !formData.lastName.trim()) {
          setError("Please provide both first and last name!")
          return
        }

        // Register user
        await register({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          password: formData.password,
          phone: formData.phoneNumber.trim() || undefined,
          role: 'guest'
        })        // Show success message
        setSuccessMessage("Account created successfully! Redirecting...")
        setTimeout(() => {
          const redirectUrl = searchParams.get('redirect') || '/'
          router.push(redirectUrl)
        }, 2000)
          } else {
        // Sign in
        try {
          await login(formData.email.trim(), formData.password)
          setSuccessMessage("Welcome back! Redirecting...")
          setTimeout(() => {
            const redirectUrl = searchParams.get('redirect') || '/'
            router.push(redirectUrl)
          }, 1500)
        } catch (loginError: any) {
          // Check if error indicates user doesn't exist or invalid credentials
          const errorMessage = loginError.message || loginError.toString()
          if (errorMessage.toLowerCase().includes('invalid credentials')) {
            // For security, we don't explicitly say if user exists or not
            // But we can provide a helpful UX
            setError("Invalid email or password. Don't have an account yet?")
          } else {
            setError(errorMessage)
          }
        }
      }
    } catch (error: any) {
      setError(error.message || "An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialAuth = (provider: string) => {
    alert(`${provider} authentication would be implemented here`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-orange-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Kostra
        </Link>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">K</span>
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                Kostra
              </span>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {mode === "signin" ? t("welcomeBack") : t("createAccount")}
            </CardTitle>
            {mode === "signin" && (
              <p className="text-sm text-gray-600 mt-2">
                New to Kostra? You'll need to create an account first.
              </p>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  <p>{error}</p>
                  {mode === "signin" && error.includes("Invalid email or password") && (
                    <button
                      onClick={() => switchMode("signup")}
                      className="text-orange-600 hover:text-orange-700 font-medium text-sm mt-2 underline"
                    >
                      Create a new account instead
                    </button>
                  )}
                </div>
              )}

              {/* Success message */}
              {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  <p>{successMessage}</p>
                </div>
              )}

              {mode === "signup" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="h-12"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="h-12"
                />
              </div>

              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">{t("phoneNumber")}</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="h-12"
                    placeholder="+977 98XXXXXXXX"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">{t("password")}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="h-12 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="h-12 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              )}

              {mode === "signup" && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agreeTerms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, agreeTerms: !!checked }))
                    }
                  />
                  <Label htmlFor="agreeTerms" className="text-sm text-gray-600">
                    I agree to the{" "}
                    <Link href="/terms" className="text-orange-600 hover:text-orange-700">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-orange-600 hover:text-orange-700">
                      Privacy Policy
                    </Link>
                  </Label>                </div>
              )}

              <Button type="submit" className="w-full h-12 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600" disabled={isLoading || !!successMessage}>
                {isLoading ? "Loading..." : successMessage ? "Redirecting..." : mode === "signin" ? "Sign In" : "Sign Up"}
              </Button>
            </form>

            {mode === "signin" && (
              <div className="text-center">
                <Link href="#" className="text-sm text-orange-600 hover:text-orange-700">
                  {t("forgotPassword")}
                </Link>
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">{t("orContinueWith")}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" onClick={() => handleSocialAuth("Google")} className="h-12">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {t("google")}
              </Button>
              <Button variant="outline" onClick={() => handleSocialAuth("Facebook")} className="h-12">
                <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                {t("facebook")}
              </Button>
            </div>

            <div className="text-center text-sm text-gray-600">
              {mode === "signin" ? (
                <>
                  {t("noAccount")}{" "}
                  <button
                    onClick={() => switchMode("signup")}
                    className="text-orange-600 hover:text-orange-700 font-medium"
                  >
                    {t("signUp")}
                  </button>
                </>
              ) : (
                <>
                  {t("haveAccount")}{" "}
                  <button
                    onClick={() => switchMode("signin")}
                    className="text-orange-600 hover:text-orange-700 font-medium"
                  >
                    {t("logIn")}
                  </button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
