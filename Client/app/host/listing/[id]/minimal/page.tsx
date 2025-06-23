"use client"

export default function MinimalPreview() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ color: 'red', fontSize: '24px' }}>MINIMAL PREVIEW PAGE</h1>
      <p>This is a minimal test page to check if routing works.</p>
      <p>If you can see this, the route is working.</p>
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: 'white', border: '1px solid #ccc' }}>
        <h2>Test Information:</h2>
        <p>Route: /host/listing/1/minimal</p>
        <p>Time: {new Date().toLocaleString()}</p>
      </div>
    </div>
  )
}
