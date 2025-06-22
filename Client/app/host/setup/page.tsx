"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Home, Building, TreePine, Coffee, Hotel } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

export default function HostSetupPage() {
  const { t } = useLanguage()
  const [selectedPropertyType, setSelectedPropertyType] = useState("")
  const totalSteps = 12 // Total internal steps across all pages: 1 + 3 + 4 + 3 + 1 = 12
  const currentGlobalStep = 1 // This page is step 1 of the overall flow
  const progress = (currentGlobalStep / totalSteps) * 100
  const propertyTypes = [
    {
      id: "apartment",
      title: t("apartment"),
      description: "A place within a multi-unit residential building",
      icon: Building,
    },
    {
      id: "house",
      title: t("house"),
      description: "A residential building, usually for one family",
      icon: Home,
    },
    {
      id: "secondary-unit",
      title: t("secondaryUnit"),
      description: "A private unit that's part of a larger property",
      icon: Home,
    },
    {
      id: "unique-space",
      title: t("uniqueSpace"),
      description: "A space that's not typically used for accommodation",
      icon: TreePine,
    },
    {
      id: "bed-breakfast",
      title: t("bedAndBreakfast"),
      description: "A small lodging establishment with breakfast included",
      icon: Coffee,
    },
    {
      id: "boutique-hotel",
      title: t("boutique"),
      description: "A small, stylish hotel with unique character",
      icon: Hotel,
    },
  ]

  const handleNext = () => {
    // Navigate directly to the next page in setup flow
    window.location.href = "/host/setup/place"
  }

  const handleBack = () => {
    // Go back to host start page
    window.location.href = "/host/start"
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
            <div className="text-sm text-gray-600">{t("kostraSetup")}</div>
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
        <div className="max-w-6xl mx-auto">
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t("whichDescribes")}</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {propertyTypes.map((type) => {
                const IconComponent = type.icon
                return (
                  <Card
                    key={type.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedPropertyType === type.id ? "ring-2 ring-purple-600 bg-purple-50" : "hover:shadow-md"
                    }`}
                    onClick={() => setSelectedPropertyType(type.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <IconComponent className="w-8 h-8 text-gray-700" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-2">{type.title}</h3>
                          <p className="text-gray-600 text-sm">{type.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleBack} className="rounded-full px-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("back")}
            </Button>

            <Button
              onClick={handleNext}
              disabled={!selectedPropertyType}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6"
            >
              {t("next")}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
