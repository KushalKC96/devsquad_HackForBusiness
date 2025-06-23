const http = require('http');
const https = require('https');

// Test property creation
async function testPropertyCreation() {
  try {
    console.log('Making test property creation request...');

    // Test property data
    const propertyData = {
      title: 'Test Property',
      description: 'A beautiful test property for debugging',
      type: 'apartment',
      address: '123 Test Street',
      city: 'Kathmandu',
      state: 'Bagmati',
      country: 'Nepal',
      zipCode: '44600',
      price: 2000,
      currency: 'NPR',
      bedrooms: 2,
      bathrooms: 1,
      maxGuests: 4,
      amenities: ['wifi', 'kitchen'],
      images: ['https://example.com/image1.jpg'],
      availability: true
    };

    console.log('Property data:', JSON.stringify(propertyData, null, 2));

    const postData = JSON.stringify(propertyData);

    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/properties',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      console.log(`Status: ${res.statusCode}`);
      console.log(`Headers: ${JSON.stringify(res.headers)}`);

      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log('Response body:', data);
        try {
          const parsed = JSON.parse(data);
          console.log('Parsed response:', JSON.stringify(parsed, null, 2));
        } catch (e) {
          console.log('Could not parse response as JSON');
        }
      });
    });

    req.on('error', (e) => {
      console.error(`Problem with request: ${e.message}`);
    });

    req.write(postData);
    req.end();

  } catch (error) {
    console.error('Error:', error.message);
  }
}

testPropertyCreation();
