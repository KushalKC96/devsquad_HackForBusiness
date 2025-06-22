"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar, Clock, Shield, AlertTriangle, Home } from "lucide-react"
import { toast } from "sonner"
import { contractsAPI } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"

interface Property {
  id: number
  title: string
  price: number
  currency: string
  bedrooms: number
  bathrooms: number
  max_guests: number
  city: string
  address: string
}

interface LongTermContractFormProps {
  property: Property
  onSuccess?: () => void
}

export function LongTermContractForm({ property, onSuccess }: LongTermContractFormProps) {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    monthly_rent: property.price,
    security_deposit: property.price * 2, // Default 2 months rent
    fine_amount: property.price, // Default 1 month rent
    terms_and_conditions: '',
    is_renewable: false,
    agree_to_terms: false
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required'
    } else if (new Date(formData.start_date) <= new Date()) {
      newErrors.start_date = 'Start date must be in the future'
    }
    
    if (!formData.end_date) {
      newErrors.end_date = 'End date is required'
    } else if (new Date(formData.end_date) <= new Date(formData.start_date)) {
      newErrors.end_date = 'End date must be after start date'
    }
    
    if (formData.monthly_rent <= 0) {
      newErrors.monthly_rent = 'Monthly rent must be greater than 0'
    }
    
    if (!formData.agree_to_terms) {
      newErrors.agree_to_terms = 'You must agree to the terms and conditions'
    }
    
    // Check minimum contract duration (30 days)
    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date)
      const endDate = new Date(formData.end_date)
      const diffInDays = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
      
      if (diffInDays < 30) {
        newErrors.end_date = 'Minimum contract duration is 30 days'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculateContractDetails = () => {
    if (!formData.start_date || !formData.end_date) return null
    
    const startDate = new Date(formData.start_date)
    const endDate = new Date(formData.end_date)
    const diffInDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24))
    const diffInMonths = Math.ceil(diffInDays / 30)
    const totalRent = formData.monthly_rent * diffInMonths
    
    return {
      durationDays: diffInDays,
      durationMonths: diffInMonths,
      totalRent,
      totalCost: totalRent + formData.security_deposit
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('Please log in to create a contract')
      return
    }

    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }

    setIsSubmitting(true)

    try {
      const contractData = {
        property_id: property.id,
        start_date: formData.start_date,
        end_date: formData.end_date,
        monthly_rent: formData.monthly_rent,
        security_deposit: formData.security_deposit,
        fine_amount: formData.fine_amount,
        terms_and_conditions: formData.terms_and_conditions || 'Standard long-term rental agreement with agreed terms and conditions.',
        is_renewable: formData.is_renewable
      }

      const response = await contractsAPI.create(contractData)
      
      if (response.success) {
        toast.success('Long-term contract request submitted successfully!')
        setIsOpen(false)
        onSuccess?.()
        
        // Reset form
        setFormData({
          start_date: '',
          end_date: '',
          monthly_rent: property.price,
          security_deposit: property.price * 2,
          fine_amount: property.price,
          terms_and_conditions: '',
          is_renewable: false,
          agree_to_terms: false
        })
      } else {
        throw new Error(response.message || 'Failed to create contract')
      }
    } catch (error) {
      console.error('Contract creation error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create contract')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contractDetails = calculateContractDetails()

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          <Home className="w-4 h-4 mr-2" />
          Long-Term Rent
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Home className="w-5 h-5" />
            Long-Term Rental Contract
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Property Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Property Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold">{property.title}</p>
                  <p className="text-gray-600">{property.address}, {property.city}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">
                    {property.currency} {property.price.toLocaleString()}/month
                  </p>
                  <p className="text-gray-600">
                    {property.bedrooms} bed • {property.bathrooms} bath • {property.max_guests} guests
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Date Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Start Date
                </Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                  className={errors.start_date ? 'border-red-500' : ''}
                />
                {errors.start_date && <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>}
              </div>
              
              <div>
                <Label htmlFor="end_date" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  End Date
                </Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  min={formData.start_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                  className={errors.end_date ? 'border-red-500' : ''}
                />
                {errors.end_date && <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>}
              </div>
            </div>

            {/* Contract Details Summary */}
            {contractDetails && (
              <Card className="bg-blue-50">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>Duration:</strong> {contractDetails.durationDays} days ({contractDetails.durationMonths} months)</p>
                      <p><strong>Monthly Rent:</strong> {property.currency} {formData.monthly_rent.toLocaleString()}</p>
                    </div>
                    <div>
                      <p><strong>Total Rent:</strong> {property.currency} {contractDetails.totalRent.toLocaleString()}</p>
                      <p><strong>Security Deposit:</strong> {property.currency} {formData.security_deposit.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-lg font-semibold">
                      <strong>Total Cost:</strong> {property.currency} {contractDetails.totalCost.toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Financial Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>                <Label htmlFor="monthly_rent" className="flex items-center gap-2">
                  Monthly Rent ({property.currency})
                </Label>
                <Input
                  id="monthly_rent"
                  type="number"
                  value={formData.monthly_rent}
                  onChange={(e) => setFormData(prev => ({ ...prev, monthly_rent: parseFloat(e.target.value) || 0 }))}
                  className={errors.monthly_rent ? 'border-red-500' : ''}
                />
                {errors.monthly_rent && <p className="text-red-500 text-sm mt-1">{errors.monthly_rent}</p>}
              </div>
              
              <div>
                <Label htmlFor="security_deposit" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Security Deposit ({property.currency})
                </Label>
                <Input
                  id="security_deposit"
                  type="number"
                  value={formData.security_deposit}
                  onChange={(e) => setFormData(prev => ({ ...prev, security_deposit: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="fine_amount" className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Early Termination Fine ({property.currency})
              </Label>
              <Input
                id="fine_amount"
                type="number"
                value={formData.fine_amount}
                onChange={(e) => setFormData(prev => ({ ...prev, fine_amount: parseFloat(e.target.value) || 0 }))}
              />
              <p className="text-sm text-gray-600 mt-1">
                Fine applied if contract is terminated early (typically 1 month rent)
              </p>
            </div>

            {/* Terms and Conditions */}
            <div>
              <Label htmlFor="terms_and_conditions">Additional Terms & Conditions</Label>
              <Textarea
                id="terms_and_conditions"
                placeholder="Enter any additional terms and conditions..."
                value={formData.terms_and_conditions}
                onChange={(e) => setFormData(prev => ({ ...prev, terms_and_conditions: e.target.value }))}
                rows={3}
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_renewable"
                  checked={formData.is_renewable}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_renewable: checked as boolean }))}
                />
                <Label htmlFor="is_renewable" className="text-sm">
                  This contract is renewable upon mutual agreement
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agree_to_terms"
                  checked={formData.agree_to_terms}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agree_to_terms: checked as boolean }))}
                  className={errors.agree_to_terms ? 'border-red-500' : ''}
                />
                <Label htmlFor="agree_to_terms" className="text-sm">
                  I agree to the terms and conditions of this long-term rental agreement
                </Label>
              </div>
              {errors.agree_to_terms && <p className="text-red-500 text-sm">{errors.agree_to_terms}</p>}
            </div>

            {/* Important Notice */}
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-yellow-800">Important Notice:</p>
                    <ul className="mt-2 space-y-1 text-yellow-700">
                      <li>• Monthly rent is fixed and cannot be changed during the contract period</li>
                      <li>• Early termination will result in the specified fine amount</li>
                      <li>• Security deposit will be refunded after contract completion (minus any damages)</li>
                      <li>• This request requires approval from the property owner</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Contract Request'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
