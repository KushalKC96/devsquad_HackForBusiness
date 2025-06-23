// Test API connectivity from frontend
console.log('Testing API connectivity...');

async function testAPI() {
    try {
        const response = await fetch('http://localhost:5000/api/properties');
        const data = await response.json();
        
        console.log('API Response Status:', response.status);
        console.log('API Response Data:', data);
        console.log('Number of properties:', data.data?.properties?.length || 0);
        
        if (data.success && data.data.properties) {
            console.log('✅ API is working correctly!');
            console.log('Sample property:', data.data.properties[0]);
        } else {
            console.log('❌ API returned unexpected format');
        }
        
        return data;
    } catch (error) {
        console.error('❌ API Error:', error);
        return { error: error.message };
    }
}

testAPI();
