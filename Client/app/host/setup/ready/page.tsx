"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

export default function GetReadyForGuestsPage() {
  const { t } = useLanguage()
  const [currentStep, setCurrentStep] = useState(1)
  const [houseRules, setHouseRules] = useState("")
  const [checkInInstructions, setCheckInInstructions] = useState("")
  const [cancellationPolicy, setCancellationPolicy] = useState("")
  const [instantBook, setInstantBook] = useState(false)
  const [availability, setAvailability] = useState({
    checkIn: "15:00",
    checkOut: "11:00",
    minStay: "1",
    maxStay: "30",
  })
  
  const totalSteps = 12 // Total internal steps across all pages: 1 + 3 + 4 + 3 + 1 = 12
  const currentGlobalStep = 8 + currentStep // Dynamic global step: 9, 10, 11 based on internal step
  const progress = (currentGlobalStep / totalSteps) * 100
  const handleNext = () => {
    if (currentStep < 3) { // Internal steps within this page (1-3)
      setCurrentStep(currentStep + 1)
    } else {
      window.location.href = "/host/setup/publish"
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      window.location.href = "/host/setup/standout"
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Set your house rules</h1>
              <p className="text-gray-600">Help guests understand what's expected during their stay.</p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="houseRules">House rules</Label>
                      <Textarea
                        id="houseRules"
                        value={houseRules}
                        onChange={(e) => setHouseRules(e.target.value)}
                        placeholder="• No smoking inside&#10;• No parties or events&#10;• Check-in is anytime after 3:00 PM&#10;• Quiet hours are between 10:00 PM and 8:00 AM"
                        className="mt-2"
                        rows={8}
                      />
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Quick rules</h4>
                      <div className="space-y-3">
                        {[
                          { label: "Suitable for children (2-12 years)", key: "children" },
                          { label: "Suitable for infants (under 2 years)", key: "infants" },
                          { label: "Pets allowed", key: "pets" },
                          { label: "Smoking allowed", key: "smoking" },
                          { label: "Events or parties allowed", key: "events" },
                        ].map((rule) => (
                          <div key={rule.key} className="flex items-center justify-between">
                            <span>{rule.label}</span>
                            <Switch />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Set your availability</h1>
              <p className="text-gray-600">Choose when guests can book and stay at your place.</p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="checkIn">Check-in time</Label>
                        <Select
                          value={availability.checkIn}
                          onValueChange={(value) => setAvailability({ ...availability, checkIn: value })}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="14:00">2:00 PM</SelectItem>
                            <SelectItem value="15:00">3:00 PM</SelectItem>
                            <SelectItem value="16:00">4:00 PM</SelectItem>
                            <SelectItem value="17:00">5:00 PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="checkOut">Check-out time</Label>
                        <Select
                          value={availability.checkOut}
                          onValueChange={(value) => setAvailability({ ...availability, checkOut: value })}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10:00">10:00 AM</SelectItem>
                            <SelectItem value="11:00">11:00 AM</SelectItem>
                            <SelectItem value="12:00">12:00 PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="minStay">Minimum stay (nights)</Label>
                        <Select
                          value={availability.minStay}
                          onValueChange={(value) => setAvailability({ ...availability, minStay: value })}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 night</SelectItem>
                            <SelectItem value="2">2 nights</SelectItem>
                            <SelectItem value="3">3 nights</SelectItem>
                            <SelectItem value="7">1 week</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="maxStay">Maximum stay (nights)</Label>
                        <Select
                          value={availability.maxStay}
                          onValueChange={(value) => setAvailability({ ...availability, maxStay: value })}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="7">1 week</SelectItem>
                            <SelectItem value="14">2 weeks</SelectItem>
                            <SelectItem value="30">1 month</SelectItem>
                            <SelectItem value="90">3 months</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Instant Book</h4>
                        <p className="text-sm text-gray-600">
                          Guests can book immediately without waiting for approval
                        </p>
                      </div>
                      <Switch checked={instantBook} onCheckedChange={setInstantBook} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Choose your policies</h1>
              <p className="text-gray-600">Set your cancellation policy and guest communication preferences.</p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="cancellationPolicy">Cancellation policy</Label>
                      <Select value={cancellationPolicy} onValueChange={setCancellationPolicy}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Choose a cancellation policy" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="flexible">
                            <div>
                              <div className="font-medium">Flexible</div>
                              <div className="text-sm text-gray-600">Full refund 1 day prior to arrival</div>
                            </div>
                          </SelectItem>
                          <SelectItem value="moderate">
                            <div>
                              <div className="font-medium">Moderate</div>
                              <div className="text-sm text-gray-600">Full refund 5 days prior to arrival</div>
                            </div>
                          </SelectItem>
                          <SelectItem value="strict">
                            <div>
                              <div className="font-medium">Strict</div>
                              <div className="text-sm text-gray-600">50% refund up until 1 week prior to arrival</div>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="checkInInstructions">Check-in instructions</Label>
                      <Textarea
                        id="checkInInstructions"
                        value={checkInInstructions}
                        onChange={(e) => setCheckInInstructions(e.target.value)}
                        placeholder="Provide detailed instructions for guests on how to check in..."
                        className="mt-2"
                        rows={4}
                      />
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Communication preferences</h4>
                      <div className="space-y-3">
                        {[
                          { label: "Send welcome message to guests", key: "welcome" },
                          { label: "Allow guests to contact you before booking", key: "preBooking" },
                          { label: "Send check-in reminders", key: "reminders" },
                        ].map((pref) => (
                          <div key={pref.key} className="flex items-center justify-between">
                            <span>{pref.label}</span>
                            <Switch defaultChecked />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              Kostra
            </Link>
            <div className="text-sm text-gray-600">Get ready for guests</div>
          </div>
        </div>
      </nav>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              Step {currentGlobalStep} of {totalSteps}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">{renderStepContent()}</div>
      </div>

      {/* Navigation Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleBack} className="rounded-full px-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={currentStep === 3 && !cancellationPolicy}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6"
            >
              {currentStep === totalSteps ? "Publish Your Listing" : "Next"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
