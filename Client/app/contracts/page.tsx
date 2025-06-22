"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ContractDashboard } from "@/components/contract-dashboard"
import { AuthGuard } from "@/components/auth-guard"
import { FileText, Users, Home } from "lucide-react"

export default function ContractsPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Contracts</h1>
                <p className="text-gray-600">Manage your long-term rental contracts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs defaultValue="customer" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="customer" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                As Customer
              </TabsTrigger>
              <TabsTrigger value="host" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                As Host
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="customer">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    My Rental Contracts
                  </CardTitle>
                  <p className="text-gray-600">
                    Contracts where you are renting properties from hosts
                  </p>
                </CardHeader>
                <CardContent>
                  <ContractDashboard userRole="customer" />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="host">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="w-5 h-5" />
                    Property Contracts
                  </CardTitle>
                  <p className="text-gray-600">
                    Contracts for your properties where guests are renting long-term
                  </p>
                </CardHeader>
                <CardContent>
                  <ContractDashboard userRole="host" />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AuthGuard>
  )
}
