"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function SimplePreviewPage() {
  const router = useRouter()
  const params = useParams()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    console.log('Simple preview: Component mounted')
    console.log('Simple preview: params:', params)
  }, [params])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Mounting...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Simple Preview Page</h1>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Params:</strong> {JSON.stringify(params)}</p>
              <p><strong>Property ID:</strong> {params.id}</p>
              <p><strong>Mounted:</strong> {mounted.toString()}</p>
              <p><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'Server-side'}</p>
            </div>
            
            <div className="mt-6">
              <Button onClick={() => router.back()}>Go Back</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
