"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Heart, Globe, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { propertiesAPI } from "@/lib/api"
import { useState, useEffect } from "react"

interface Property {
  id: number;
  title: string;
  city: string;
  price: number;
  type: string;
  images: string[];
  avgRating?: string;
  reviewCount: number;
  host_first_name: string;
  host_last_name: string;
}

export default function KostraHomepage() {
  const { language, setLanguage, t } = useLanguage()
  const { user, logout, loading: authLoading } = useAuth()
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const stats = [
    { number: "100+", label: language === "np" ? "शहरहरू" : "Cities" },
    { number: "500", label: language === "np" ? "सम्पत्तिहरू" : "Properties" },
    { number: "1M+", label: language === "np" ? "खुसी पाहुनाहरू" : "Happy Guests" },
  ]

  // Fetch featured properties
  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        const response = await propertiesAPI.getAll({ limit: 8 })
        setFeaturedProperties(response.data.properties)
      } catch (error) {
        console.error('Failed to fetch properties:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchFeaturedProperties()
  }, [])

  // Early return for auth loading
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold text-gray-900">
              Kostra
            </Link>            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/explore" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                {t("explore")}
              </Link>
              <Link href="/contracts" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                {language === "np" ? "दीर्घकालीन भाडा" : "Long-Term Rentals"}
              </Link>
              <Link href="/host" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                {t("becomeHost")}
              </Link>
              <Link href="/help" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                {t("help")}
              </Link>
            </div>{/* User Menu */}
            <div className="flex items-center space-x-4">
              {/* Language Toggle */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                    <Globe className="w-4 h-4 mr-2" />
                    {language === "np" ? "नेपाली" : "English"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setLanguage("en")}>English</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage("np")}>नेपाली</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>              {/* Conditional rendering based on user authentication */}
              {authLoading ? (
                <div className="w-8 h-8">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
              ) : user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700 font-medium">
                    {language === "np" ? `नमस्कार, ${user.firstName}` : `Hello, ${user.firstName}`}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center">
                          {user.firstName.charAt(0).toUpperCase()}
                        </div>
                      </Button>
                    </DropdownMenuTrigger>                    <DropdownMenuContent align="end" className="w-56">
                      <div className="px-3 py-2 border-b">
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/guest">
                          {language === "np" ? "गेस्ट डाशबोर्ड" : "Guest Dashboard"}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/host">
                          {language === "np" ? "होस्ट डाशबोर्ड" : "Host Dashboard"}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/contracts">
                          {language === "np" ? "सम्झौताहरू" : "My Contracts"}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/explore">
                          {language === "np" ? "अन्वेषण गर्नुहोस्" : "Explore Properties"}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/help">
                          {language === "np" ? "सहायता" : "Help"}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={logout} className="text-red-600">
                        {language === "np" ? "लगआउट" : "Logout"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/auth?mode=signin">
                    <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                      {language === "np" ? "लगिन" : "Login"}
                    </Button>
                  </Link>
                  <Link href="/host/start">
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full">
                      {language === "np" ? "सुरु गर्नुहोस्" : "Get started"}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                {language === "np" ? "संसारका उत्तम गन्तव्यहरू अन्वेषण गर्नुहोस्" : "Explore the world's best destinations"}
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                {language === "np"
                  ? "हजारौं प्रमाणित सम्पत्तिहरूबाट आफ्नो सपनाको बासस्थान फेला पार्नुहोस्"
                  : "Find your dream accommodation from thousands of verified properties"}
              </p>              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="/explore">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full">
                    {language === "np" ? "थप पत्ता लगाउनुहोस्" : "Discover more"}
                  </Button>
                </Link>
                <Link href="/contracts">
                  <Button
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-full"
                  >
                    {language === "np" ? "दीर्घकालीन भाडा" : "Long-Term Rentals"}
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                    <div className="text-gray-600 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>            <div className="relative">
              <Image
                src="/placeholder.svg?height=400&width=500"
                alt="Beautiful destination"
                width={500}
                height={400}
                className="rounded-2xl shadow-2xl"
                style={{ width: "auto", height: "auto" }}
              />
            </div>
          </div>
        </div>      </section>

      {/* Long-Term Rental Feature Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
                🏠 {language === "np" ? "नयाँ सुविधा" : "New Feature"}
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                {language === "np" 
                  ? "दीर्घकालीन भाडा सम्झौताहरू" 
                  : "Long-Term Rental Contracts"}
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                {language === "np"
                  ? "अब तपाईं महिनौं वा वर्षौंको लागि सुरक्षित सम्झौताहरूसँग सम्पत्तिहरू भाडामा लिन सक्नुहुन्छ। निश्चित मूल्य र स्पष्ट सर्तहरूको साथ।"
                  : "Now you can rent properties for months or years with secure contracts. Fixed pricing and clear terms guaranteed."}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {language === "np" ? "निश्चित मूल्य" : "Fixed Pricing"}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {language === "np" 
                        ? "सम्झौता अवधिभर मासिक भाडा परिवर्तन हुँदैन"
                        : "Monthly rent locked throughout contract period"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">⚖️</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {language === "np" ? "कानुनी सुरक्षा" : "Legal Protection"}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {language === "np" 
                        ? "दुबै पक्षका लागि स्पष्ट नियम र सर्तहरू"
                        : "Clear terms and conditions for both parties"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold">📋</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {language === "np" ? "सजिलो व्यवस्थापन" : "Easy Management"}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {language === "np" 
                        ? "डिजिटल प्लेटफर्ममा सबै सम्झौताहरू व्यवस्थापन गर्नुहोस्"
                        : "Manage all contracts on our digital platform"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 font-bold">🛡️</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {language === "np" ? "सुरक्षा जमानत" : "Security Deposit"}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {language === "np" 
                        ? "सम्पत्ति सुरक्षाको लागि जमानत राशि"
                        : "Deposit protection for property security"}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/explore">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full">
                    {language === "np" ? "सम्पत्तिहरू खोज्नुहोस्" : "Browse Properties"}
                  </Button>
                </Link>
                <Link href="/contracts">
                  <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-full">
                    {language === "np" ? "मेरा सम्झौताहरू" : "My Contracts"}
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    {language === "np" ? "सम्झौता उदाहरण" : "Sample Contract"}
                  </h3>
                  <Badge className="bg-green-100 text-green-800">
                    {language === "np" ? "सक्रिय" : "Active"}
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{language === "np" ? "सम्पत्ति:" : "Property:"}</span>
                    <span className="font-semibold">Modern Apartment, Kathmandu</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{language === "np" ? "अवधि:" : "Duration:"}</span>
                    <span className="font-semibold">12 {language === "np" ? "महिना" : "months"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{language === "np" ? "मासिक भाडा:" : "Monthly Rent:"}</span>
                    <span className="font-semibold text-green-600">NPR 25,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{language === "np" ? "जमानत:" : "Security Deposit:"}</span>
                    <span className="font-semibold">NPR 50,000</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-gray-900 font-semibold">{language === "np" ? "कुल लागत:" : "Total Cost:"}</span>
                      <span className="font-bold text-lg text-blue-600">NPR 3,50,000</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex space-x-3">
                  <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                    {language === "np" ? "विवरण हेर्नुहोस्" : "View Details"}
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    {language === "np" ? "सम्पादन गर्नुहोस्" : "Manage"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>      {/* Search Bar */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
              <Button 
                variant="ghost" 
                className="rounded-md px-6 py-2 bg-purple-600 text-white hover:bg-purple-700"
              >
                {language === "np" ? "छोटो अवधि" : "Short-term"}
              </Button>
              <Link href="/contracts">
                <Button 
                  variant="ghost" 
                  className="rounded-md px-6 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  {language === "np" ? "दीर्घकालीन भाडा" : "Long-term Rental"}
                </Button>
              </Link>
            </div>
          </div>
          
          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Where</label>
                  <Input
                    placeholder={language === "np" ? "गन्तव्य खोज्नुहोस्" : "Search destinations"}
                    className="h-12 border-gray-200"
                  />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check in</label>
                  <Input placeholder="Add dates" className="h-12 border-gray-200" />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check out</label>
                  <Input placeholder="Add dates" className="h-12 border-gray-200" />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Who</label>
                  <Input placeholder="Add guests" className="h-12 border-gray-200" />
                </div>
              </div>
              
              <div className="mt-4 flex justify-center">
                <Link href="/explore">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full">
                    {language === "np" ? "खोज्नुहोस्" : "Search"}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {language === "np" ? "यस महिनाका शीर्ष-रेटेड सम्पत्तिहरू" : "Top-rated properties this month"}
            </h2>
          </div>          {loading ? (
            <div className="flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProperties.map((property) => {
                const propertyImages = Array.isArray(property.images) ? property.images : 
                  (typeof property.images === 'string' ? JSON.parse(property.images) : ['/placeholder.svg?height=200&width=300'])
                
                return (
                  <Link key={property.id} href={`/property/${property.id}`}>
                    <Card className="group cursor-pointer overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">                      <div className="relative">
                        <Image
                          src={propertyImages[0] || "/placeholder.svg"}
                          alt={property.title}
                          width={300}
                          height={200}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          style={{ width: "auto", height: "auto" }}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-3 right-3 bg-white/80 hover:bg-white text-gray-700 rounded-full"
                        >
                          <Heart className="w-4 h-4" />
                        </Button>
                        <Badge className="absolute top-3 left-3 bg-purple-600 text-white text-xs capitalize">
                          {property.type}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 line-clamp-2">{property.title}</h3>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium text-gray-700 ml-1">
                              {property.avgRating || 'New'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-600 mb-3">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="text-sm">{property.city}, Nepal</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-lg font-bold text-gray-900">NPR {property.price.toLocaleString()}</span>
                            <span className="text-gray-600 text-sm ml-1">/ {t("night")}</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {property.reviewCount} {t("reviews")}
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          Host: {property.host_first_name} {property.host_last_name}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">            <div>
              <Image
                src="/placeholder.svg?height=300&width=400"
                alt="Newsletter"
                width={400}
                height={300}
                className="rounded-2xl shadow-lg"
                style={{ width: "auto", height: "auto" }}
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {language === "np"
                  ? "विशेष अपडेटहरूको लागि हाम्रो न्यूजलेटरमा सामेल हुनुहोस्"
                  : "Join our newsletter for exclusive updates on the latest travel deals and trending destinations."}
              </h2>
              <p className="text-gray-600 mb-6">
                {language === "np"
                  ? "नवीनतम यात्रा सम्झौताहरू र ट्रेन्डिङ गन्तव्यहरूमा।"
                  : "Get the best deals and discover amazing places before everyone else."}
              </p>
              <div className="flex gap-4">
                <Input
                  placeholder={language === "np" ? "आफ्नो इमेल ठेगाना प्रविष्ट गर्नुहोस्" : "Enter your email address"}
                  className="flex-1 h-12"
                />
                <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full">
                  {language === "np" ? "सब्स्क्राइब गर्नुहोस्" : "Subscribe"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4">Kostra</div>
              <p className="text-gray-400 mb-4">{t("footerDescription")}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">{t("support")}</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white transition-colors">
                    {t("helpCenter")}
                  </Link>
                </li>
                <li>
                  <Link href="/company/safety" className="hover:text-white transition-colors">
                    {t("safetyInfo")}
                  </Link>
                </li>
                <li>
                  <Link href="/help/contact" className="hover:text-white transition-colors">
                    {t("contactUs")}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">{t("community")}</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/host" className="hover:text-white transition-colors">
                    {t("becomeHost")}
                  </Link>
                </li>
                <li>
                  <Link href="/host/resources" className="hover:text-white transition-colors">
                    {t("hostResources")}
                  </Link>
                </li>
                <li>
                  <Link href="/company/referral" className="hover:text-white transition-colors">
                    {t("referralProgram")}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">{t("about")}</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    {t("aboutKostra")}
                  </Link>
                </li>
                <li>
                  <Link href="/company/careers" className="hover:text-white transition-colors">
                    {t("careers")}
                  </Link>
                </li>
                <li>
                  <Link href="/company/press" className="hover:text-white transition-colors">
                    {t("press")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 mb-4 md:mb-0">© 2024 Kostra, Inc. All rights reserved.</div>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Globe className="w-4 h-4 mr-2" />
                  {language === "np" ? "नेपाली (NP)" : "English (NP)"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
