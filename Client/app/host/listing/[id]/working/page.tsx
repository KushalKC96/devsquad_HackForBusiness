"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"

export default function WorkingPreviewPage() {
  const router = useRouter()
  const params = useParams()
  const [mounted, setMounted] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>({})

  useEffect(() => {
    console.log('Working preview: Component mounted')
    console.log('Working preview: params:', params)
    
    setMounted(true)
    setDebugInfo({
      params: params,
      propertyId: params.id,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      url: typeof window !== 'undefined' ? window.location.href : 'server'
    })
  }, [params])

  if (!mounted) {
    return <div style={{ padding: '20px' }}>Loading...</div>
  }

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f8f9fa', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ color: '#28a745', marginBottom: '20px' }}>
          ✅ Working Preview Page
        </h1>
        
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <h2 style={{ marginBottom: '15px', color: '#495057' }}>Property Preview</h2>
          <p style={{ fontSize: '18px', marginBottom: '10px' }}>
            Property ID: <strong>{params.id}</strong>
          </p>
          <p style={{ color: '#6c757d' }}>
            This page is now working correctly. The routing issue has been resolved.
          </p>
        </div>

        <div style={{ 
          backgroundColor: '#e9ecef', 
          padding: '15px', 
          borderRadius: '5px',
          fontSize: '14px'
        }}>
          <h3 style={{ marginBottom: '10px' }}>Debug Information:</h3>
          <pre style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '10px', 
            borderRadius: '3px',
            overflow: 'auto',
            fontSize: '12px'
          }}>
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>

        <div style={{ marginTop: '20px' }}>
          <button 
            onClick={() => router.back()}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ← Go Back
          </button>
        </div>

        <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#d4edda', borderRadius: '5px' }}>
          <h3 style={{ color: '#155724', marginBottom: '10px' }}>Next Steps:</h3>
          <ul style={{ color: '#155724' }}>
            <li>The basic routing is now working</li>
            <li>You can now add back the API calls</li>
            <li>Add back the context providers if needed</li>
            <li>Style with your UI components</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
