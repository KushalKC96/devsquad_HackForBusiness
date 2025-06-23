// Test full host setup flow
const http = require('http');

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: data, headers: res.headers });
        }
      });
    });

    req.on('error', reject);

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function testFullFlow() {
  try {
    console.log('=== Testing Full Host Setup Flow ===\n');

    // Step 1: Register a new user
    console.log('1. Registering new user...');
    const registerData = {
      firstName: 'Test',
      lastName: 'Host',
      email: `testhost${Date.now()}@example.com`,
      password: 'password123'
    };

    const registerOptions = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(registerData))
      }
    };

    const registerResponse = await makeRequest(registerOptions, JSON.stringify(registerData));
    console.log('Register Status:', registerResponse.status);
    
    if (registerResponse.status !== 201) {
      console.error('Registration failed:', registerResponse.data);
      return;
    }    const token = registerResponse.data.data.token; // Token is inside data.data
    console.log('✓ Registration successful');
    console.log('Token received:', token ? `${token.substring(0, 30)}...` : 'No token');

    // Step 2: Test property creation
    console.log('\n2. Creating property...');
    const propertyData = {
      title: 'Test Property for Debugging',
      description: 'A beautiful test property to debug the property creation flow',
      type: 'apartment',
      address: '123 Test Street, Thamel',
      city: 'Kathmandu',
      state: 'Bagmati',
      country: 'Nepal',
      zipCode: '44600',
      price: 2500,
      currency: 'NPR',
      bedrooms: 2,
      bathrooms: 1,
      maxGuests: 4,
      amenities: ['wifi', 'kitchen', 'ac'],
      images: ['test-image-1.jpg', 'test-image-2.jpg'],
      availability: true
    };

    const propertyOptions = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/properties',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(propertyData)),
        'Authorization': `Bearer ${token}`
      }
    };

    console.log('Property data being sent:');
    console.log(JSON.stringify(propertyData, null, 2));

    const propertyResponse = await makeRequest(propertyOptions, JSON.stringify(propertyData));
    console.log('\nProperty Creation Status:', propertyResponse.status);
    
    if (propertyResponse.status === 201) {
      console.log('✓ Property creation successful!');
      console.log('Created property:', JSON.stringify(propertyResponse.data, null, 2));
    } else {
      console.error('❌ Property creation failed:');
      console.error('Status:', propertyResponse.status);
      console.error('Response:', JSON.stringify(propertyResponse.data, null, 2));
    }

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testFullFlow();
