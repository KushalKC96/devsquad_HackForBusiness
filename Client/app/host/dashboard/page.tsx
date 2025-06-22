"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  DollarSign, 
  Home, 
  Star, 
  Users, 
  Settings, 
  Plus,
  Eye,
  Edit,
  BarChart3,
  MessageCircle,
  Clock
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"

interface Listing {
  id: string
  title: string
  photos: string[]
  status: 'active' | 'inactive' | 'pending'
  bookings: number
  revenue: number
  rating: number
  reviews: number
}

interface BookingData {
  id: string
  guestName: string
  checkIn: string
  checkOut: string
  status: 'upcoming' | 'current' | 'completed' | 'cancelled'
  total: number
  listing: string
}

export default function HostDashboard() {
  const { t } = useLanguage()
  const [listings, setListings] = useState<Listing[]>([])
  const [recentBookings, setRecentBookings] = useState<BookingData[]>([])
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    activeListings: 0,
    averageRating: 0
  })

  useEffect(() => {
    // Load mock data - in real app this would come from API
    const mockListings: Listing[] = [
      {
        id: '1',
        title: 'Cozy Mountain View Apartment',
        photos: ['/placeholder.jpg'],
        status: 'active',
        bookings: 12,
        revenue: 45000,
        rating: 4.8,
        reviews: 8
      }
    ]

    const mockBookings: BookingData[] = [
      {
        id: '1',
        guestName: 'John Doe',
        checkIn: '2024-01-15',
        checkOut: '2024-01-18',
        status: 'upcoming',
        total: 12000,
        listing: 'Cozy Mountain View Apartment'
      },
      {
        id: '2',
        guestName: 'Jane Smith',
        checkIn: '2024-01-10',
        checkOut: '2024-01-12',
        status: 'completed',
        total: 8000,
        listing: 'Cozy Mountain View Apartment'
      }
    ]

    setListings(mockListings)
    setRecentBookings(mockBookings)
    
    // Calculate stats
    setStats({
      totalRevenue: mockListings.reduce((sum, listing) => sum + listing.revenue, 0),
      totalBookings: mockListings.reduce((sum, listing) => sum + listing.bookings, 0),
      activeListings: mockListings.filter(listing => listing.status === 'active').length,
      averageRating: mockListings.reduce((sum, listing) => sum + listing.rating, 0) / mockListings.length
    })
  }, [])

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      upcoming: 'bg-blue-100 text-blue-800',
      current: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              Kostra
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/host/create">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Listing
                </Button>
              </Link>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Host Dashboard</h1>
          <p className="text-gray-600">Manage your listings and track your performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    NPR {stats.totalRevenue.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Listings</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeListings}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Home className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Rating</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.averageRating.toFixed(1)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Listings */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Your Listings
                  <Link href="/host/create">
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Add New
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {listings.length === 0 ? (
                  <div className="text-center py-8">
                    <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No listings yet</h3>
                    <p className="text-gray-600 mb-4">Create your first listing to start hosting</p>
                    <Link href="/host/create">
                      <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                        Create Listing
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {listings.map((listing) => (
                      <div key={listing.id} className="border rounded-lg p-4">
                        <div className="flex items-start space-x-4">
                          <Image
                            src={listing.photos[0] || "/placeholder.jpg"}
                            alt={listing.title}
                            width={80}
                            height={60}
                            className="rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-medium text-gray-900">{listing.title}</h3>
                                <Badge className={`mt-1 ${getStatusBadge(listing.status)}`}>
                                  {listing.status}
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Link href={`/host/listing/${listing.id}/preview`}>
                                  <Button size="sm" variant="outline">
                                    <Eye className="w-4 h-4 mr-1" />
                                    View
                                  </Button>
                                </Link>
                                <Button size="sm" variant="outline">
                                  <Edit className="w-4 h-4 mr-1" />
                                  Edit
                                </Button>
                              </div>
                            </div>
                            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                              <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {listing.bookings} bookings
                              </span>                              <span className="flex items-center">
                                NPR {listing.revenue.toLocaleString()}
                              </span>
                              <span className="flex items-center">
                                <Star className="w-4 h-4 mr-1" />
                                {listing.rating} ({listing.reviews} reviews)
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {recentBookings.length === 0 ? (
                  <div className="text-center py-6">
                    <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No bookings yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentBookings.map((booking) => (
                      <div key={booking.id} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{booking.guestName}</p>
                            <p className="text-sm text-gray-600">{booking.listing}</p>
                            <p className="text-xs text-gray-500">
                              {booking.checkIn} - {booking.checkOut}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge className={`mb-1 ${getStatusBadge(booking.status)}`}>
                              {booking.status}
                            </Badge>
                            <p className="text-sm font-medium">NPR {booking.total.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Messages
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="w-4 h-4 mr-2" />
                    Calendar
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
