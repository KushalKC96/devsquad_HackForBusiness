"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DollarSign,
  Users,
  Calendar,
  Shield,
  Star,
  Home,
  Camera,
  MessageCircle,
  ArrowRight,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { AuthGuard } from "@/components/auth-guard"

export default function BecomeHostPage() {
  const { t } = useLanguage()
  const [earningsData, setEarningsData] = useState({
    location: "",
    propertyType: "",
    bedrooms: "1",
    bathrooms: "1",
    nightsPerMonth: "15",
  })

  const calculateEarnings = () => {
    const baseRate = {
      apartment: 3500,
      house: 4500,
      room: 2500,
      villa: 6500,
    }

    const rate = baseRate[earningsData.propertyType as keyof typeof baseRate] || 3500
    const bedroomMultiplier = Number.parseInt(earningsData.bedrooms) * 0.3 + 0.7
    const nights = Number.parseInt(earningsData.nightsPerMonth)

    return Math.round(rate * bedroomMultiplier * nights)
  }
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                Kostra
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">{t("becomeHostTitle")}</h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">{t("becomeHostSubtitle")}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t("earnMoney")}</h3>
              <p className="text-gray-600">{t("earnMoneyDesc")}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t("meetPeople")}</h3>
              <p className="text-gray-600">{t("meetPeopleDesc")}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t("flexibleSchedule")}</h3>
              <p className="text-gray-600">{t("flexibleScheduleDesc")}</p>
            </div>
          </div>

          <Button
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold text-lg px-8 py-4 rounded-xl"
            asChild
          >
            <Link href="/host/setup/place" className="flex items-center">
              {t("startHosting")}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* How to Start Hosting */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t("hostingSteps")}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/host/setup/place">
              <Card className="text-center border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Home className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{t("step1")}</h3>
                  <p className="text-gray-600">{t("step1Desc")}</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/host/setup/standout">
              <Card className="text-center border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Camera className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{t("step2")}</h3>
                  <p className="text-gray-600">{t("step2Desc")}</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/host/setup/ready">
              <Card className="text-center border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageCircle className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{t("step3")}</h3>
                  <p className="text-gray-600">{t("step3Desc")}</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Earnings Calculator */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t("estimatedEarnings")}</h2>
          </div>

          <Card className="shadow-xl border-0">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="location">{t("location")}</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Kathmandu, Nepal"
                      value={earningsData.location}
                      onChange={(e) => setEarningsData({ ...earningsData, location: e.target.value })}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="propertyType">{t("propertyTypeLabel")}</Label>
                    <Select
                      value={earningsData.propertyType}
                      onValueChange={(value) => setEarningsData({ ...earningsData, propertyType: value })}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">{t("apartment")}</SelectItem>
                        <SelectItem value="house">{t("house")}</SelectItem>
                        <SelectItem value="room">{t("room")}</SelectItem>
                        <SelectItem value="villa">{t("villa")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bedrooms">{t("bedrooms")}</Label>
                      <Select
                        value={earningsData.bedrooms}
                        onValueChange={(value) => setEarningsData({ ...earningsData, bedrooms: value })}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="bathrooms">{t("bathrooms")}</Label>
                      <Select
                        value={earningsData.bathrooms}
                        onValueChange={(value) => setEarningsData({ ...earningsData, bathrooms: value })}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="nights">{t("nightsPerMonth")}</Label>
                    <Select
                      value={earningsData.nightsPerMonth}
                      onValueChange={(value) => setEarningsData({ ...earningsData, nightsPerMonth: value })}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="15">15</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="30">30</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-orange-600 mb-4">
                      NPR {earningsData.propertyType ? calculateEarnings().toLocaleString() : "0"}
                    </div>
                    <p className="text-gray-600 text-lg">per month</p>
                    <p className="text-sm text-gray-500 mt-2">*Estimated earnings based on similar listings</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why Host with Kostra */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t("whyHost")}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <Shield className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Host Protection</h3>
                <p className="text-sm text-gray-600">Comprehensive insurance coverage for your property</p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <Star className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Quality Guests</h3>
                <p className="text-sm text-gray-600">Verified guests with reviews and ratings</p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <MessageCircle className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">24/7 Support</h3>
                <p className="text-sm text-gray-600">Round-the-clock support for hosts and guests</p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <CheckCircle className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Easy Management</h3>
                <p className="text-sm text-gray-600">Simple tools to manage bookings and communicate</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Ready to start hosting?</h2>
          <p className="text-xl text-gray-600 mb-8">Join thousands of hosts who are earning extra income with Kostra</p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold text-lg px-8 py-4 rounded-xl"
            asChild
          >
            <Link href="/host/setup/place" className="flex items-center">
              {t("startHosting")}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>        </div>
      </section>
      </div>
    </AuthGuard>
  )
}
