"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Calendar, 
  DollarSign, 
  Home, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  FileText,
  User,
  MapPin
} from "lucide-react"
import { toast } from "sonner"
import { contractsAPI } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"

interface Contract {
  contract_id: number
  property_id: number
  customer_id: number
  start_date: string
  end_date: string
  monthly_rent: number
  fine_amount: number
  security_deposit: number
  status: 'active' | 'completed' | 'terminated_early' | 'pending'
  terms_and_conditions: string
  is_renewable: boolean
  termination_reason?: string
  terminated_at?: string
  total_fine_applied: number
  created_at: string
  updated_at: string
  
  // Joined data
  property_title: string
  property_address: string
  property_city: string
  property_images: string
  customer_first_name: string
  customer_last_name: string
  host_first_name: string
  host_last_name: string
}

interface ContractDashboardProps {
  userRole: 'customer' | 'host'
}

export function ContractDashboard({ userRole }: ContractDashboardProps) {
  const { user } = useAuth()
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  
  useEffect(() => {
    fetchContracts()
  }, [filter, userRole])

  const fetchContracts = async () => {
    try {
      setLoading(true)
      const response = await contractsAPI.getAll({
        role: userRole,
        ...(filter !== 'all' && { status: filter })
      })
      
      if (response.success) {
        setContracts(response.data.contracts)
      }
    } catch (error) {
      console.error('Error fetching contracts:', error)
      toast.error('Failed to load contracts')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'terminated_early':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'terminated_early':
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const calculateDaysRemaining = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleApproveContract = async (contractId: number) => {
    try {
      const response = await contractsAPI.approve(contractId)
      if (response.success) {
        toast.success('Contract approved successfully!')
        fetchContracts()
      }
    } catch (error) {
      console.error('Error approving contract:', error)
      toast.error('Failed to approve contract')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {userRole === 'customer' ? 'My Rental Contracts' : 'Property Contracts'}
        </h2>
        
        {/* Filter Buttons */}
        <div className="flex gap-2">
          {['all', 'pending', 'active', 'completed', 'terminated_early'].map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(status)}
              className="capitalize"
            >
              {status.replace('_', ' ')}
            </Button>
          ))}
        </div>
      </div>

      {/* Contracts List */}
      {contracts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <FileText className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Contracts Found</h3>
            <p className="text-gray-500 text-center">
              {userRole === 'customer' 
                ? "You haven't created any long-term rental contracts yet."
                : "No one has requested long-term rentals for your properties yet."
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {contracts.map((contract) => (
            <ContractCard
              key={contract.contract_id}
              contract={contract}
              userRole={userRole}
              onUpdate={fetchContracts}
              onApprove={handleApproveContract}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface ContractCardProps {
  contract: Contract
  userRole: 'customer' | 'host'
  onUpdate: () => void
  onApprove: (contractId: number) => void
}

function ContractCard({ contract, userRole, onUpdate, onApprove }: ContractCardProps) {
  const [showTerminateDialog, setShowTerminateDialog] = useState(false)
  const [terminationReason, setTerminationReason] = useState('')
  const [isTerminating, setIsTerminating] = useState(false)

  const calculateDaysRemaining = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  const daysRemaining = calculateDaysRemaining(contract.end_date)
  const isActive = contract.status === 'active'
  const canTerminate = isActive && daysRemaining > 0 && userRole === 'customer'

  const handleTerminate = async () => {
    if (!terminationReason.trim()) {
      toast.error('Please provide a reason for termination')
      return
    }

    try {
      setIsTerminating(true)
      const response = await contractsAPI.terminate(contract.contract_id, terminationReason)
      
      if (response.success) {
        toast.success(`Contract terminated. Fine of ${response.data.fine_applied} has been applied.`)
        setShowTerminateDialog(false)
        setTerminationReason('')
        onUpdate()
      }
    } catch (error) {
      console.error('Error terminating contract:', error)
      toast.error('Failed to terminate contract')
    } finally {
      setIsTerminating(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'terminated_early':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'terminated_early':
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Home className="w-5 h-5" />
              {contract.property_title}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <MapPin className="w-4 h-4" />
              {contract.property_address}, {contract.property_city}
            </div>
          </div>
          <Badge className={`${getStatusColor(contract.status)} flex items-center gap-1`}>
            {getStatusIcon(contract.status)}
            {contract.status.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Contract Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              Start Date
            </div>
            <p className="font-semibold">{formatDate(contract.start_date)}</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              End Date
            </div>
            <p className="font-semibold">{formatDate(contract.end_date)}</p>
            {isActive && (
              <p className="text-xs text-gray-500">
                {daysRemaining > 0 ? `${daysRemaining} days left` : 'Expired'}
              </p>
            )}
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <DollarSign className="w-4 h-4" />
              Monthly Rent
            </div>
            <p className="font-semibold">NPR {contract.monthly_rent.toLocaleString()}</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <User className="w-4 h-4" />
              {userRole === 'customer' ? 'Host' : 'Customer'}
            </div>
            <p className="font-semibold">
              {userRole === 'customer' 
                ? `${contract.host_first_name} ${contract.host_last_name}`
                : `${contract.customer_first_name} ${contract.customer_last_name}`
              }
            </p>
          </div>
        </div>

        {/* Additional Details */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div>
            <p className="text-sm text-gray-600">Security Deposit</p>
            <p className="font-semibold">NPR {contract.security_deposit.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Early Termination Fine</p>
            <p className="font-semibold">NPR {contract.fine_amount.toLocaleString()}</p>
          </div>
        </div>

        {/* Termination Details (if applicable) */}
        {contract.status === 'terminated_early' && (
          <div className="bg-red-50 p-3 rounded-lg border border-red-200">
            <div className="flex items-center gap-2 text-red-800 font-semibold mb-2">
              <AlertTriangle className="w-4 h-4" />
              Early Termination
            </div>
            <div className="text-sm space-y-1">
              <p><strong>Terminated:</strong> {formatDate(contract.terminated_at!)}</p>
              <p><strong>Fine Applied:</strong> NPR {contract.total_fine_applied.toLocaleString()}</p>
              {contract.termination_reason && (
                <p><strong>Reason:</strong> {contract.termination_reason}</p>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {contract.status === 'pending' && userRole === 'host' && (
            <Button
              onClick={() => onApprove(contract.contract_id)}
              className="bg-green-600 hover:bg-green-700"
            >
              Approve Contract
            </Button>
          )}
          
          {canTerminate && (
            <Dialog open={showTerminateDialog} onOpenChange={setShowTerminateDialog}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Terminate Early
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Terminate Contract Early</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2 text-yellow-800 font-semibold mb-2">
                      <AlertTriangle className="w-4 h-4" />
                      Early Termination Warning
                    </div>
                    <p className="text-sm text-yellow-700">
                      Terminating this contract early will result in a fine of{' '}
                      <strong>NPR {contract.fine_amount.toLocaleString()}</strong>.
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="termination_reason">Reason for Termination</Label>
                    <Textarea
                      id="termination_reason"
                      placeholder="Please provide a detailed reason for early termination..."
                      value={terminationReason}
                      onChange={(e) => setTerminationReason(e.target.value)}
                      rows={4}
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowTerminateDialog(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleTerminate}
                      disabled={isTerminating || !terminationReason.trim()}
                      className="flex-1"
                    >
                      {isTerminating ? 'Terminating...' : 'Confirm Termination'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
