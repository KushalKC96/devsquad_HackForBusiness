"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  MapPin, 
  Users, 
  Bed, 
  Bath, 
  Star, 
  Wifi, 
  Car, 
  ChefHat,
  ArrowLeft,
  Calendar as CalendarIcon,
  CreditCard,
  Shield,
  MessageCircle,
  Heart,
  Share,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import Link from "next/link"
import { propertiesAPI, bookingsAPI } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import { LongTermContractForm } from "@/components/long-term-contract-form"
import type { DateRange } from "react-day-picker"

interface Property {
  id: number;
  title: string;
  description: string;
  city: string;
  address: string;
  price: number;
  currency: string;
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
  host_avatar?: string;
  availability: boolean;
}

interface Review {
  id: number;
  rating: number;
  comment: string;
  first_name: string;
  last_name: string;
  avatar?: string;
  created_at: string;
}

export default function PropertyDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [property, setProperty] = useState<Property | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [selectedDates, setSelectedDates] = useState<DateRange | undefined>(undefined)
  const [guests, setGuests] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [bookingNotes, setBookingNotes] = useState("")

  useEffect(() => {
    if (id) {
      fetchProperty()
    }
  }, [id])
  const fetchProperty = async () => {
    try {
      setLoading(true)
      const response = await propertiesAPI.getById(id as string)
      if (response.success) {
        const propertyData = response.data.property
        
        // Ensure images is always an array
        if (propertyData.images && typeof propertyData.images === 'string') {
          try {
            propertyData.images = JSON.parse(propertyData.images)
          } catch {
            propertyData.images = [propertyData.images]
          }
        } else if (!Array.isArray(propertyData.images)) {
          propertyData.images = []
        }
        
        // Ensure amenities is always an array
        if (propertyData.amenities && typeof propertyData.amenities === 'string') {
          try {
            propertyData.amenities = JSON.parse(propertyData.amenities)
          } catch {
            propertyData.amenities = propertyData.amenities.split(',').map((a: string) => a.trim())
          }
        } else if (!Array.isArray(propertyData.amenities)) {
          propertyData.amenities = []
        }
        
        setProperty(propertyData)
        setReviews(response.data.reviews || [])
      }
    } catch (error) {
      console.error('Error fetching property:', error)
      toast.error('Failed to load property details')
    } finally {
      setLoading(false)
    }
  }
  const calculateTotalPrice = () => {
    if (!selectedDates?.from || !selectedDates?.to || !property) return 0
    const days = Math.ceil((selectedDates.to.getTime() - selectedDates.from.getTime()) / (1000 * 60 * 60 * 24))
    return days * property.price
  }
  
  const handleBooking = async () => {
    if (!user) {
      const currentPath = window.location.pathname + window.location.search;
      router.push(`/auth?redirect=${encodeURIComponent(currentPath)}`)
      return
    }

    if (!selectedDates?.from || !selectedDates?.to || !property) {
      toast.error('Please select check-in and check-out dates')
      return
    }

    // Redirect to checkout page with booking details
    const checkoutParams = new URLSearchParams({
      propertyId: property.id.toString(),
      propertyTitle: property.title,
      checkIn: selectedDates.from.toISOString().split('T')[0],
      checkOut: selectedDates.to.toISOString().split('T')[0],
      guests: guests.toString(),
      nights: nights.toString(),
      pricePerNight: property.price.toString(),
      totalPrice: totalPrice.toString(),
      currency: property.currency
    })

    router.push(`/checkout?${checkoutParams.toString()}`)
  }
  const nextImage = () => {
    if (Array.isArray(property?.images) && property.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length)
    }
  }

  const previousImage = () => {
    if (Array.isArray(property?.images) && property.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading property details...</p>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Property not found</p>
          <Link href="/explore">
            <Button className="mt-4">Back to Explore</Button>
          </Link>
        </div>
      </div>
    )
  }
  const totalPrice = calculateTotalPrice()
  const nights = selectedDates?.from && selectedDates?.to 
    ? Math.ceil((selectedDates.to.getTime() - selectedDates.from.getTime()) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/explore" className="inline-flex items-center text-gray-600 hover:text-orange-600">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Explore
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{property.address}, {property.city}</span>
              </div>
              <div className="flex items-center space-x-4">
                {property.avgRating && (
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    <span className="font-medium">{property.avgRating}</span>
                    <span className="text-gray-600 ml-1">({property.reviewCount} reviews)</span>
                  </div>
                )}
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {property.max_guests} guests
                  </span>
                  <span className="flex items-center">
                    <Bed className="w-4 h-4 mr-1" />
                    {property.bedrooms} bedrooms
                  </span>
                  <span className="flex items-center">
                    <Bath className="w-4 h-4 mr-1" />
                    {property.bathrooms} bathrooms
                  </span>
                </div>
              </div>
            </div>            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={Array.isArray(property.images) && property.images[currentImageIndex] 
                      ? property.images[currentImageIndex] 
                      : '/placeholder.svg?height=400&width=600'}
                    alt={property.title}
                    className="w-full h-64 md:h-96 object-cover rounded-t-lg"
                  />
                  {Array.isArray(property.images) && property.images.length > 1 && (
                    <>
                      <button
                        onClick={previousImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {property.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full ${
                              index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About this place</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </CardContent>
            </Card>            {/* Amenities */}
            {Array.isArray(property.amenities) && property.amenities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>What this place offers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-6 h-6 flex items-center justify-center">
                          {amenity.toLowerCase().includes('wifi') && <Wifi className="w-4 h-4" />}
                          {amenity.toLowerCase().includes('parking') && <Car className="w-4 h-4" />}
                          {amenity.toLowerCase().includes('kitchen') && <ChefHat className="w-4 h-4" />}
                          {!['wifi', 'parking', 'kitchen'].some(key => amenity.toLowerCase().includes(key)) && (
                            <div className="w-4 h-4 bg-gray-300 rounded-full" />
                          )}
                        </div>
                        <span className="text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Host Information */}
            <Card>
              <CardHeader>
                <CardTitle>Meet your host</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={property.host_avatar} />
                    <AvatarFallback>
                      {property.host_first_name[0]}{property.host_last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{property.host_first_name} {property.host_last_name}</p>
                    <p className="text-sm text-gray-600">Host</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            {reviews.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current mr-2" />
                    {property.avgRating} · {property.reviewCount} reviews
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reviews.slice(0, 3).map((review) => (
                      <div key={review.id} className="border-b pb-4 last:border-b-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={review.avatar} />
                            <AvatarFallback>
                              {review.first_name[0]}{review.last_name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{review.first_name} {review.last_name}</p>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>
                    <span className="text-2xl font-bold">{property.currency} {property.price.toLocaleString()}</span>
                    <span className="text-gray-600"> night</span>
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Date Selection */}
                <div>
                  <Label className="text-sm font-medium">Select dates</Label>
                  <Calendar
                    mode="range"
                    selected={selectedDates}
                    onSelect={setSelectedDates}
                    className="rounded-md border mt-2"
                    disabled={(date) => date < new Date()}
                  />
                </div>

                {/* Guest Selection */}
                <div>
                  <Label htmlFor="guests" className="text-sm font-medium">Guests</Label>
                  <Input
                    id="guests"
                    type="number"
                    min="1"
                    max={property.max_guests}
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="mt-1"
                  />
                </div>                {/* Price Breakdown */}
                {selectedDates?.from && selectedDates?.to && (
                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span>{property.currency} {property.price.toLocaleString()} x {nights} nights</span>
                      <span>{property.currency} {totalPrice.toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>{property.currency} {totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                {/* Booking Notes */}
                <div>
                  <Label htmlFor="notes" className="text-sm font-medium">Special requests (optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special requests or notes for the host..."
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>                {/* Book Button */}
                <Button
                  onClick={handleBooking}
                  disabled={!selectedDates?.from || !selectedDates?.to || bookingLoading}
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                  size="lg"
                >
                  {bookingLoading ? (
                    "Processing..."
                  ) : selectedDates?.from && selectedDates?.to ? (
                    `Reserve - ${property.currency} ${totalPrice.toLocaleString()}`
                  ) : (
                    "Select dates to book"
                  )}
                </Button>

                {/* Long-Term Contract Button */}
                <div className="pt-2">
                  <LongTermContractForm 
                    property={{
                      id: property.id,
                      title: property.title,
                      price: property.price,
                      currency: property.currency,
                      bedrooms: property.bedrooms,
                      bathrooms: property.bathrooms,
                      max_guests: property.max_guests,
                      city: property.city,
                      address: property.address
                    }}
                    onSuccess={() => {
                      toast.success('Contract request submitted successfully!')
                    }}
                  />
                </div>

                {user && (
                  <p className="text-xs text-gray-600 text-center">
                    You won't be charged until your booking is confirmed
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
