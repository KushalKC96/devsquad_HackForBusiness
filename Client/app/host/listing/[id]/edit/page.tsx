"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  MapPin, 
  Users, 
  Bed, 
  Bath, 
  DollarSign,
  Loader2,
  Plus,
  X
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
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
}

const AMENITIES = [
  'Wi-Fi', 'Parking', 'Kitchen', 'Pool', 'Air Conditioning', 
  'Balcony', 'Mountain View', 'Lake View', 'Wildlife View'
]

const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'villa', label: 'Villa' },
  { value: 'cabin', label: 'Cabin' },
  { value: 'hotel', label: 'Hotel' }
]

export default function EditListingPage() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const propertyId = params.id as string

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true)
        console.log('Fetching property with ID:', propertyId)
        const response = await propertiesAPI.getById(propertyId)
        console.log('Property response:', response)
        setProperty(response.data)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch property:', err)
        setError('Failed to load property. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    if (propertyId) {
      fetchProperty()
    }
  }, [propertyId])

  const handleSave = async () => {
    if (!property) return

    try {
      setSaving(true)
      await propertiesAPI.update(propertyId, property)
      router.push(`/host/listing/${propertyId}/preview`)
    } catch (err) {
      console.error('Failed to save property:', err)
      setError('Failed to save changes. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    if (!property) return

    const currentAmenities = Array.isArray(property.amenities) ? property.amenities : 
      (typeof property.amenities === 'string' ? JSON.parse(property.amenities) : [])

    let updatedAmenities
    if (checked) {
      updatedAmenities = [...currentAmenities, amenity]
    } else {
      updatedAmenities = currentAmenities.filter((a: string) => a !== amenity)
    }

    setProperty({ ...property, amenities: updatedAmenities })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>Loading property details...</p>
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
            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
        </div>
      </div>
    )
  }

  const propertyAmenities = Array.isArray(property.amenities) ? property.amenities : 
    (typeof property.amenities === 'string' ? JSON.parse(property.amenities) : [])

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
                <h1 className="text-xl font-semibold">Edit Your Listing</h1>
                <p className="text-sm text-gray-500">Update your property details</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/host/listing/${propertyId}/preview`}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Link>
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Title
                </label>
                <Input
                  value={property.title}
                  onChange={(e) => setProperty({ ...property, title: e.target.value })}
                  placeholder="Enter property title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <Textarea
                  value={property.description}
                  onChange={(e) => setProperty({ ...property, description: e.target.value })}
                  placeholder="Describe your property"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Type
                  </label>
                  <Select
                    value={property.type}
                    onValueChange={(value) => setProperty({ ...property, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROPERTY_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price per Night ({property.currency})
                  </label>
                  <Input
                    type="number"
                    value={property.price}
                    onChange={(e) => setProperty({ ...property, price: parseInt(e.target.value) })}
                    placeholder="Enter price"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <Input
                  value={property.address}
                  onChange={(e) => setProperty({ ...property, address: e.target.value })}
                  placeholder="Enter address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <Input
                    value={property.city}
                    onChange={(e) => setProperty({ ...property, city: e.target.value })}
                    placeholder="Enter city"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <Input
                    value={property.state}
                    onChange={(e) => setProperty({ ...property, state: e.target.value })}
                    placeholder="Enter state"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <Input
                    value={property.country}
                    onChange={(e) => setProperty({ ...property, country: e.target.value })}
                    placeholder="Enter country"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Details */}
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bedrooms
                  </label>
                  <Input
                    type="number"
                    value={property.bedrooms}
                    onChange={(e) => setProperty({ ...property, bedrooms: parseInt(e.target.value) })}
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bathrooms
                  </label>
                  <Input
                    type="number"
                    value={property.bathrooms}
                    onChange={(e) => setProperty({ ...property, bathrooms: parseInt(e.target.value) })}
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Guests
                  </label>
                  <Input
                    type="number"
                    value={property.max_guests}
                    onChange={(e) => setProperty({ ...property, max_guests: parseInt(e.target.value) })}
                    min="1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card>
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {AMENITIES.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-3">
                    <Checkbox
                      id={amenity}
                      checked={propertyAmenities.includes(amenity)}
                      onCheckedChange={(checked) =>
                        handleAmenityChange(amenity, checked as boolean)
                      }
                    />
                    <label htmlFor={amenity} className="text-sm text-gray-700 cursor-pointer">
                      {amenity}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Availability */}
          <Card>
            <CardHeader>
              <CardTitle>Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="availability"
                  checked={property.availability}
                  onCheckedChange={(checked) =>
                    setProperty({ ...property, availability: checked as boolean })
                  }
                />
                <label htmlFor="availability" className="text-sm text-gray-700 cursor-pointer">
                  Property is available for booking
                </label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
