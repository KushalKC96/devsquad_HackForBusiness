"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Star, Calendar, DollarSign, Users, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"
import { AuthGuard } from "@/components/auth-guard"
import { propertiesAPI } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"

interface SetupData {
  // Property Type (from /host/setup)
  propertyType?: string
  
  // Place Details (from /host/setup/place)
  location?: {
    address: string
    city: string
    state: string
    country: string
    zipCode: string
  }
  guestCounts?: {
    guests: number
    bedrooms: number
    beds: number
    bathrooms: number
  }
  
  // Standout Details (from /host/setup/standout)
  photos?: string[]
  title?: string
  description?: string
  selectedAmenities?: string[]
  
  // Pricing (if from another step)
  pricing?: {
    basePrice: string
    cleaningFee: string
    securityDeposit: string
  }
  
  timestamp: number
}

export default function PublishListingPage() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [isPublishing, setIsPublishing] = useState(false)
  const [isPublished, setIsPublished] = useState(false)
  const [setupData, setSetupData] = useState<SetupData | null>(null)
  const [publishError, setPublishError] = useState<string | null>(null)
  useEffect(() => {
    // Load setup data from localStorage
    try {
      const propertyType = localStorage.getItem('host_setup_property_type')
      const placeData = localStorage.getItem('host_setup_place_data')
      const standoutData = localStorage.getItem('host_setup_standout_data')
      
      if (standoutData) {
        const parsedStandoutData = JSON.parse(standoutData)
        const parsedPlaceData = placeData ? JSON.parse(placeData) : {}
        
        setSetupData({
          propertyType: propertyType || '',
          ...parsedPlaceData,
          ...parsedStandoutData,
          timestamp: Date.now()
        })
      }
    } catch (error) {
      console.error('Error loading setup data:', error)
      setPublishError('Failed to load listing data. Please go back and complete the setup.')
    }
  }, [])

  const calculateTotalPrice = () => {
    if (!setupData?.pricing) return 0
    const basePrice = Number(setupData.pricing.basePrice) || 0
    const cleaningFee = Number(setupData.pricing.cleaningFee) || 0
    return basePrice + cleaningFee
  }
  const handlePublish = async () => {
    if (!setupData || !user) {
      setPublishError('Missing listing data or user authentication.')
      return
    }

    setIsPublishing(true)
    setPublishError(null)

    try {      // Prepare property data for API
      const propertyData = {
        title: setupData.title || 'Untitled Property',
        description: setupData.description || 'No description provided',
        type: setupData.propertyType || 'apartment',
        address: setupData.location?.address || '',
        city: setupData.location?.city || '',
        state: setupData.location?.state || '',
        country: setupData.location?.country || 'Nepal',
        zipCode: setupData.location?.zipCode || '', // Frontend sends zipCode
        price: parseFloat(setupData.pricing?.basePrice || '1000'),
        currency: 'NPR',
        bedrooms: setupData.guestCounts?.bedrooms || 1,
        bathrooms: setupData.guestCounts?.bathrooms || 1,
        maxGuests: setupData.guestCounts?.guests || 1,
        amenities: setupData.selectedAmenities || [],
        images: setupData.photos || [],
        availability: true
      }

      console.log('Publishing property with data:', propertyData)

      // Create property in database
      const response = await propertiesAPI.create(propertyData)
      
      if (response.success) {
        // Clear localStorage data after successful creation
        localStorage.removeItem('host_setup_property_type')
        localStorage.removeItem('host_setup_place_data')
        localStorage.removeItem('host_setup_standout_data')
        
        setIsPublished(true)
        toast.success('Your listing has been published successfully!')
      } else {
        throw new Error(response.message || 'Failed to publish listing')
      }
    } catch (error) {
      console.error('Publish error:', error)
      setPublishError(error instanceof Error ? error.message : 'Failed to publish listing. Please try again.')
      toast.error('Failed to publish listing. Please try again.')
    } finally {
      setIsPublishing(false)
    }
  }

  if (isPublished) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center px-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Congratulations!</h1>
          <p className="text-xl text-gray-600 mb-8">
            Your listing is now live on Kostra. Guests can start booking your place!
          </p>

          <div className="space-y-4 mb-8">
            <Link href="/host/dashboard">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3">Go to Host Dashboard</Button>
            </Link>            <Link href="/host/listing/preview">
              <Button variant="outline" className="w-full py-3">
                Preview Your Listing
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="w-full py-3">
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-2">What's next?</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Keep your calendar updated</li>
              <li>• Respond to guest inquiries quickly</li>
              <li>• Provide excellent hospitality</li>
              <li>• Collect great reviews</li>
            </ul>
          </div>
        </div>
      </div>
    )  }
  return (
    <AuthGuard>
      <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              Kostra
            </Link>
            <div className="text-sm text-gray-600">Step 12 of 12 - Publish your listing</div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Review and publish</h1>
          <p className="text-xl text-gray-600">Here's what we'll show to guests. Make sure everything looks good!</p>
        </div>

        {!setupData ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No setup data found. Please complete the previous steps first.</p>
            <Link href="/host/setup/standout">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                Go back to setup
              </Button>
            </Link>
          </div>
        ) : (

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Listing Preview */}
          <div>
            <Card className="overflow-hidden">              <div className="relative">
                <Image
                  src={setupData?.photos && setupData.photos.length > 0 ? setupData.photos[0] : "/placeholder.svg?height=250&width=400"}
                  alt="Your listing"
                  width={400}
                  height={250}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-3 left-3 bg-purple-600 text-white px-2 py-1 rounded text-sm font-medium">
                  NEW
                </div>
                {setupData?.photos && setupData.photos.length > 1 && (
                  <div className="absolute bottom-3 right-3 bg-black/50 text-white px-2 py-1 rounded text-sm">
                    +{setupData.photos.length - 1} more
                  </div>
                )}
              </div><CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">{setupData?.title || "Cozy Mountain View Apartment"}</h3>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">New</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-3">Kathmandu, Nepal</p>
                <div className="flex items-center text-gray-600 mb-4">
                  <Users className="w-4 h-4 mr-1" />
                  <span className="text-sm">2 guests • 1 bedroom • 1 bed • 1 bathroom</span>
                </div>
                
                {/* Pricing Breakdown */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="font-medium mb-3">Price breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Base price per night</span>
                      <span>NPR {setupData?.pricing?.basePrice ? Number(setupData.pricing.basePrice).toLocaleString() : "0"}</span>
                    </div>
                    {setupData?.pricing?.cleaningFee && Number(setupData.pricing.cleaningFee) > 0 && (
                      <div className="flex justify-between">
                        <span>Cleaning fee</span>
                        <span>NPR {Number(setupData.pricing.cleaningFee).toLocaleString()}</span>
                      </div>
                    )}
                    {setupData?.pricing?.securityDeposit && Number(setupData.pricing.securityDeposit) > 0 && (
                      <div className="flex justify-between text-gray-500">
                        <span>Security deposit (refundable)</span>
                        <span>NPR {Number(setupData.pricing.securityDeposit).toLocaleString()}</span>
                      </div>
                    )}
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total per night</span>
                        <span>NPR {calculateTotalPrice().toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-sm text-gray-500">
                  <p>{setupData?.description || "A beautiful place to stay with amazing amenities."}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Checklist */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Your listing checklist</h3>
                <div className="space-y-3">
                  {[
                    { item: "Property type and location", completed: true },
                    { item: "Guest capacity and amenities", completed: true },
                    { item: "Photos and description", completed: true },
                    { item: "Pricing and availability", completed: true },
                    { item: "House rules and policies", completed: true },
                  ].map((check, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className={check.completed ? "text-gray-900" : "text-gray-500"}>{check.item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">What happens next?</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <Calendar className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Your listing goes live</h4>
                      <p className="text-sm text-gray-600">Guests can find and book your place immediately</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <DollarSign className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Start earning</h4>
                      <p className="text-sm text-gray-600">Get paid 24 hours after guests check in</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handlePublish}
              disabled={isPublishing}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 text-lg"
            >
              {isPublishing ? "Publishing..." : "Publish Listing"}
              {!isPublishing && <ArrowRight className="w-5 h-5 ml-2" />}
            </Button>

            <p className="text-sm text-gray-500 text-center">
              By publishing, you agree to Kostra's{" "}
              <Link href="/terms" className="text-purple-600 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/host-guarantee" className="text-purple-600 hover:underline">
                Host Guarantee
              </Link>
            </p>          </div>
        </div>        )}
      </div>
      </div>
    </AuthGuard>
  )
}
