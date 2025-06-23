"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Star, MapPin, Heart, Wifi, Car, ChefHat, Waves, Snowflake, Home, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { propertiesAPI } from "@/lib/api"

interface Property {
  id: number;
  title: string;
  city: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  type: string;
  amenities: string[];
  images: string[];
  avgRating?: string;
  reviewCount: number;
  host_first_name: string;
  host_last_name: string;
  availability: boolean;
}

export default function ExplorePage() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000])
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const amenityIcons = {
    'Wi-Fi': Wifi,
    'Wifi': Wifi,
    'Parking': Car,
    'Kitchen': ChefHat,
    'Pool': Waves,
    'Air Conditioning': Snowflake,
    'Balcony': Home,
    'Mountain View': Home,
    'Lake View': Waves,
    'Wildlife View': Home,
  }
  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true)
        console.log('🔍 Fetching properties from API...')
        console.log('🌐 API Base URL:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000')
        
        const response = await propertiesAPI.getAll({
          page: 1,
          limit: 1000, // Increased limit to get all properties
          sortBy: 'created_at', // Sort by creation date
          sortOrder: 'desc', // Newest first
          ...(searchQuery && { city: searchQuery }),
          ...(priceRange[0] && { minPrice: priceRange[0] }),
          ...(priceRange[1] && { maxPrice: priceRange[1] }),
        })
        
        console.log('✅ API Response received:', response)
        console.log('📊 Response structure:', {
          success: response.success,
          hasData: !!response.data,
          hasProperties: !!response.data?.properties,
          propertiesLength: response.data?.properties?.length || 0
        })
        
        if (response.success && response.data && response.data.properties) {
          console.log('🏠 Properties fetched:', response.data.properties.length)
          console.log('🔍 First property sample:', response.data.properties[0])
          setProperties(response.data.properties)
        } else {
          console.warn('⚠️ Unexpected API response structure:', response)
          setProperties([])
        }
        setError(null)      } catch (err) {
        console.error('❌ Failed to fetch properties:', err)
        console.error('📋 Error details:', {
          message: (err as Error).message || 'Unknown error',
          stack: (err as Error).stack || 'No stack trace',
          name: (err as Error).name || 'Unknown'
        })
        setError('Failed to load properties. Please try again.')
        setProperties([]) // Ensure we clear any stale data
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [searchQuery, priceRange]) // Removed currentPage dependency to fetch all at once

  // Function to manually refresh properties
  const refreshProperties = async () => {
    try {
      setLoading(true)
      console.log('Manually refreshing properties...')
      const response = await propertiesAPI.getAll({
        page: 1,
        limit: 1000, // Increased limit to get all properties
        sortBy: 'created_at', // Sort by creation date
        sortOrder: 'desc', // Newest first
        ...(searchQuery && { city: searchQuery }),
        ...(priceRange[0] && { minPrice: priceRange[0] }),
        ...(priceRange[1] && { maxPrice: priceRange[1] }),
      })
      
      console.log('Refresh API Response:', response)
      console.log('Properties refreshed:', response.data.properties.length)
      setProperties(response.data.properties)
      setError(null)
    } catch (err) {
      console.error('Failed to refresh properties:', err)
      setError('Failed to refresh properties. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Auto-refresh when page becomes visible (e.g., when navigating back from other pages)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && properties.length > 0) {
        console.log('Page became visible, refreshing properties...')
        refreshProperties()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [properties.length]) // Re-run when properties change

  // Also refresh when component mounts/user navigates to this page
  useEffect(() => {
    const handleFocus = () => {
      console.log('Window focused, refreshing properties...')
      refreshProperties()
    }

    window.addEventListener('focus', handleFocus)
    
    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    if (checked) {
      setSelectedAmenities([...selectedAmenities, amenity])
    } else {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity))
    }
  }

  const handlePropertyTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setSelectedPropertyTypes([...selectedPropertyTypes, type])
    } else {
      setSelectedPropertyTypes(selectedPropertyTypes.filter((t) => t !== type))
    }
  }
  const filteredProperties = properties.filter((property) => {
    const propertyAmenities = Array.isArray(property.amenities) ? property.amenities : 
      (typeof property.amenities === 'string' ? JSON.parse(property.amenities) : [])
    
    const matchesAmenities =
      selectedAmenities.length === 0 || selectedAmenities.every((amenity) => 
        propertyAmenities.some((propAmenity: string) => 
          propAmenity.toLowerCase().includes(amenity.toLowerCase())
        )
      )
    const matchesPropertyType = selectedPropertyTypes.length === 0 || selectedPropertyTypes.includes(property.type)
    const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1]

    return matchesAmenities && matchesPropertyType && matchesPrice
  })
  console.log('Total properties:', properties.length)
  console.log('Filtered properties:', filteredProperties.length)
  console.log('Selected amenities:', selectedAmenities)
  console.log('Selected property types:', selectedPropertyTypes)
  console.log('Price range:', priceRange)
  
  const clearAllFilters = () => {
    setSelectedAmenities([])
    setSelectedPropertyTypes([])
    setPriceRange([0, 100000])
    setSearchQuery('')
  }
  const handleHostClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!user) {
      // User is not logged in, redirect to login page with redirect parameter
      router.push('/auth?redirect=/host')
    } else {
      // User is logged in, check if they want to go to dashboard or start hosting
      if (user.role === 'host') {
        router.push('/host/dashboard')
      } else {
        router.push('/host')
      }
    }
  }
  const sortedProperties = [...filteredProperties]

  const handleSearch = () => {
    setCurrentPage(1)
    // The useEffect will automatically trigger with the new searchQuery
  }

  const handlePropertyClick = (propertyId: number, e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault()
      const currentPath = `/property/${propertyId}`
      router.push(`/auth?redirect=${encodeURIComponent(currentPath)}`)
    }
  }

  if (loading && properties.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading properties...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center text-white font-bold text-sm mr-2">
                K
              </div>
              <span className="text-xl font-bold text-gray-900">Kostra</span>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search destinations..."
                  className="pl-10 border-gray-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>            {/* Navigation */}
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium">
                Home
              </Link>
              <button 
                onClick={handleHostClick}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer"
              >
                {user ? "Host Dashboard" : "Become a Host"}
              </button>
              <Link href="/help" className="text-gray-600 hover:text-gray-900 font-medium">
                Help
              </Link>
              {user && (
                <div className="text-sm text-gray-500">
                  Welcome, {user.firstName}
                </div>
              )}
            </div>
          </div>        </div>
      </div>      {/* Page Title Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Explore Properties
            </h1>
            <p className="text-lg text-gray-600">
              Discover unique accommodations across Nepal - from mountain lodges to lakeside villas
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-8">
          {/* Left Sidebar - Filters */}
          <div className="w-80 shrink-0">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearAllFilters}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Clear All
                </Button>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h3 className="text-sm font-medium mb-4">Price Range</h3>
                <div className="mb-4">                  <Slider
                    value={priceRange}
                    onValueChange={(value: number[]) => setPriceRange([value[0], value[1]])}
                    max={100000}
                    min={0}
                    step={1000}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>NPR {priceRange[0].toLocaleString()}</span>
                  <span>NPR {priceRange[1].toLocaleString()}</span>
                </div>
              </div>

              {/* Property Type */}
              <div className="mb-8">
                <h3 className="text-sm font-medium mb-4">Property Type</h3>
                <div className="space-y-3">
                  {["Apartment", "House", "Villa", "Cabin", "Hotel"].map((type) => (
                    <div key={type} className="flex items-center space-x-3">
                      <Checkbox
                        id={type}
                        checked={selectedPropertyTypes.includes(type.toLowerCase())}
                        onCheckedChange={(checked) =>
                          handlePropertyTypeChange(type.toLowerCase(), checked as boolean)
                        }
                        className="rounded"
                      />
                      <label htmlFor={type} className="text-sm text-gray-700 cursor-pointer">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-4">Amenities</h3>
                <div className="space-y-3">
                  {["Wi-Fi", "Parking", "Kitchen", "Pool", "Air Conditioning", "Balcony"].map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-3">
                      <Checkbox
                        id={amenity}
                        checked={selectedAmenities.includes(amenity)}
                        onCheckedChange={(checked) =>
                          handleAmenityChange(amenity, checked as boolean)
                        }
                        className="rounded"
                      />
                      <label htmlFor={amenity} className="text-sm text-gray-700 cursor-pointer">
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">            {/* Results Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h1 className="text-lg font-medium text-gray-900">
                  {loading ? 'Loading...' : `${sortedProperties.length} results found`}
                </h1>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={refreshProperties}
                  disabled={loading}
                  className="flex items-center space-x-2"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
                </Button>
              </div>
              {/* Debug information */}
              <div className="text-sm text-gray-500 mt-2">
                <p>Total properties fetched: {properties.length}</p>
                <p>After filtering: {filteredProperties.length}</p>
                {error && <p className="text-red-500">Error: {error}</p>}
              </div>
            </div>{/* Properties Grid */}
            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                <p>Loading properties...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>Try Again</Button>
              </div>
            ) : sortedProperties.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">
                  {properties.length === 0 
                    ? 'No properties available in the database.' 
                    : 'No properties found matching your criteria.'
                  }
                </p>
                <Button variant="outline" onClick={clearAllFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProperties.map((property, index) => {                  const propertyAmenities = Array.isArray(property.amenities) ? property.amenities : 
                    (typeof property.amenities === 'string' ? JSON.parse(property.amenities) : [])
                  const propertyImages = Array.isArray(property.images) ? property.images : 
                    (typeof property.images === 'string' ? JSON.parse(property.images) : ['/placeholder.svg?height=200&width=300'])

                  return (
                    <Link                      key={property.id} 
                      href={`/property/${property.id}`}
                      onClick={(e) => handlePropertyClick(property.id, e)}
                    >
                      <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-gray-200 overflow-hidden">
                        <div className="relative">                          <div className="aspect-[4/3] relative overflow-hidden">                            <Image
                              src={propertyImages[0] || '/placeholder.svg?height=200&width=300'}
                              alt={property.title}
                              fill
                              priority={index < 4}
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {!user && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <div className="text-center text-white">
                                  <p className="text-sm font-medium">Login to view details</p>
                                  <p className="text-xs mt-1">Sign in to book this property</p>
                                </div>
                              </div>
                            )}
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="absolute top-3 right-3 bg-white/80 hover:bg-white shadow-sm"
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                          {property.availability && (
                            <Badge className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1">
                              Instant Book
                            </Badge>
                          )}
                        </div>

                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-medium text-sm line-clamp-2 flex-1 text-gray-900">
                              {property.title}
                            </h3>
                            <div className="flex items-center ml-2">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                              <span className="text-xs font-medium">
                                {property.avgRating || '4.5'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center text-gray-500 text-xs mb-3">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{property.city}, Nepal</span>
                          </div>

                          <div className="mb-3">
                            <div className="flex items-baseline">
                              <span className="text-lg font-semibold text-gray-900">
                                NPR {property.price.toLocaleString()}
                              </span>
                              <span className="text-xs text-gray-500 ml-1">/ night</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {property.reviewCount} reviews
                            </div>
                          </div>

                          <div className="text-xs text-gray-600">
                            Hosted by {property.host_first_name} {property.host_last_name}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
