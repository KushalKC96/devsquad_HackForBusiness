"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  MapPin, 
  Users, 
  Bed, 
  Bath, 
  Wifi, 
  Car, 
  ChefHat, 
  Waves, 
  Snowflake, 
  Home,
  Edit,
  Eye,
  Share,
  Heart,
  Star,
  Loader2
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
// import { useLanguage } from "@/contexts/language-context"
// import { useAuth } from "@/contexts/auth-context"
import { propertiesAPI } from "@/lib/api"

interface Property {
  id: number;
  title: string;
  description: string;
  city: string;
  state: string;
  country: string;
  address: string;
  price: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  type: string;
  amenities: string[];
  images: string[];
  availability: boolean;
  avgRating?: string;
  reviewCount: number;
  host_first_name: string;
  host_last_name: string;
  created_at: string;
  updated_at: string;
}

export default function ListingPreviewPage() {
  // const { t } = useLanguage()
  // const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  const propertyId = params.id as string

  // Early debug logging
  console.log('Preview page: Component mounted')
  console.log('Preview page: propertyId from params:', propertyId)
  console.log('Preview page: params object:', params)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Early return for debugging
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Mounting...</h1>
        </div>
      </div>
    )
  }

  if (!propertyId) {
    console.error('Preview page: No propertyId found in params')
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Debug: No Property ID</h1>
          <p>Params: {JSON.stringify(params)}</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

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
  useEffect(() => {
    const fetchProperty = async () => {      try {
        setLoading(true)
        console.log('Preview page: Starting fetch for property ID:', propertyId)
        // console.log('Preview page: User:', user)
        
        const response = await propertiesAPI.getById(propertyId)
        console.log('Preview page: Property response:', response)
        
        if (response && response.data) {
          setProperty(response.data)
          setError(null)
          console.log('Preview page: Property set successfully')
        } else {
          console.error('Preview page: Invalid response structure:', response)
          setError('Invalid property data received')
        }
      } catch (err) {
        console.error('Preview page: Failed to fetch property:', err)
        setError(`Failed to load property: ${err instanceof Error ? err.message : 'Unknown error'}`)
      } finally {
        setLoading(false)
        console.log('Preview page: Loading finished')
      }
    }

    console.log('Preview page: useEffect triggered with propertyId:', propertyId)
    if (propertyId) {
      fetchProperty()
    } else {
      console.error('Preview page: No propertyId provided')
      setError('No property ID provided')
      setLoading(false)
    }
  }, [propertyId])
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>Loading property preview...</p>
            <div className="mt-4 p-4 bg-gray-100 rounded-lg text-left text-sm">
              <h3 className="font-bold mb-2">Debug Info:</h3>              <p>Property ID: {propertyId}</p>
              <p>Loading: {loading.toString()}</p>
              <p>Error: {error || 'None'}</p>
              <p>User: Not available in debug mode</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error || 'Property not found'}</p>
            <div className="mt-4 p-4 bg-gray-100 rounded-lg text-left text-sm">
              <h3 className="font-bold mb-2">Debug Info:</h3>
              <p>Property ID: {propertyId}</p>
              <p>Loading: {loading.toString()}</p>              <p>Error: {error || 'None'}</p>
              <p>Property exists: {property ? 'Yes' : 'No'}</p>
              <p>User: Not available in debug mode</p>
            </div>
            <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
          </div>
        </div>
      </div>
    )
  }

  const propertyAmenities = Array.isArray(property.amenities) ? property.amenities : 
    (typeof property.amenities === 'string' ? JSON.parse(property.amenities) : [])
  const propertyImages = Array.isArray(property.images) ? property.images : 
    (typeof property.images === 'string' ? JSON.parse(property.images) : ['/placeholder.svg?height=400&width=600'])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <div>
                <h1 className="text-xl font-semibold">Preview Your Listing</h1>
                <p className="text-sm text-gray-500">See how guests will view your property</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button asChild>
                <Link href={`/host/listing/${propertyId}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Listing
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Property Images */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="aspect-[4/3] relative overflow-hidden rounded-lg">
                <Image
                  src={propertyImages[0] || '/placeholder.svg?height=400&width=600'}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
              </div>
              {propertyImages.length > 1 && (
                <div className="grid grid-cols-2 gap-4">                  {propertyImages.slice(1, 5).map((image: string, index: number) => (
                    <div key={index} className="aspect-[4/3] relative overflow-hidden rounded-lg">
                      <Image
                        src={image || '/placeholder.svg?height=200&width=300'}
                        alt={`${property.title} - Image ${index + 2}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg p-6 mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {property.title}
                    </h1>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{property.city}, {property.state}, {property.country}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{property.max_guests} guests</span>
                      </div>
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1" />
                        <span>{property.bedrooms} bedroom{property.bedrooms !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        <span>{property.bathrooms} bathroom{property.bathrooms !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center mb-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="font-medium">{property.avgRating || '4.5'}</span>
                    </div>
                    <p className="text-sm text-gray-500">{property.reviewCount} reviews</p>
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <h2 className="text-lg font-semibold mb-3">About this place</h2>
                  <p className="text-gray-700 leading-relaxed">{property.description}</p>
                </div>

                <Separator className="my-6" />

                <div>
                  <h2 className="text-lg font-semibold mb-4">What this place offers</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {propertyAmenities.length > 0 ? (
                      propertyAmenities.map((amenity: string, index: number) => {
                        const IconComponent = amenityIcons[amenity as keyof typeof amenityIcons] || Home
                        return (
                          <div key={index} className="flex items-center space-x-3">
                            <IconComponent className="h-5 w-5 text-gray-600" />
                            <span className="text-sm">{amenity}</span>
                          </div>
                        )
                      })
                    ) : (
                      <p className="text-gray-500 text-sm">No amenities listed</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Location</h2>
                <div className="text-gray-700">
                  <p className="mb-2">{property.address}</p>
                  <p>{property.city}, {property.state}, {property.country}</p>
                </div>
              </div>
            </div>

            {/* Booking Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="flex items-baseline">
                      <span className="text-2xl font-bold">
                        {property.currency} {property.price.toLocaleString()}
                      </span>
                      <span className="text-gray-500 ml-1">/ night</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Check-in
                      </label>
                      <div className="border rounded-lg p-3 text-gray-500">
                        Select date
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Check-out
                      </label>
                      <div className="border rounded-lg p-3 text-gray-500">
                        Select date
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Guests
                      </label>
                      <div className="border rounded-lg p-3 text-gray-500">
                        1 guest
                      </div>
                    </div>
                  </div>

                  <Button className="w-full mb-4" disabled>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Mode
                  </Button>

                  <div className="text-center text-sm text-gray-500">
                    <p>This is how guests will see your booking form</p>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Property Type</span>
                      <span className="capitalize">{property.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status</span>
                      <Badge variant={property.availability ? "default" : "secondary"}>
                        {property.availability ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Host</span>
                      <span>{property.host_first_name} {property.host_last_name}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
