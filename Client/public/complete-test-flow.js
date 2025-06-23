// Complete test flow for property publishing
console.log('Starting complete property publishing test flow...');

async function testPropertyPublishFlow() {
  try {
    // Step 1: Clear any existing data
    console.log('1. Clearing existing localStorage data...');
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('host_setup_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Step 2: Setup test user (simulate login)
    console.log('2. Setting up test user authentication...');
    const testUser = {
      id: 1,
      email: 'testhost@example.com',
      firstName: 'Test',
      lastName: 'Host',
      token: 'test-jwt-token-123'
    };
    localStorage.setItem('kostra_user', JSON.stringify(testUser));
    localStorage.setItem('kostra_token', testUser.token);
    
    // Step 3: Setup valid property data
    console.log('3. Setting up valid property data...');
    
    // Property type
    localStorage.setItem('host_setup_property_type', 'apartment');
    
    // Place data
    const placeData = {
      location: {
        address: '123 Mountain View Street',
        city: 'Kathmandu',
        state: 'Bagmati',
        country: 'Nepal',
        zipCode: '44600'
      },
      guestCounts: {
        guests: 4,
        bedrooms: 2,
        beds: 2,
        bathrooms: 1
      },
      timestamp: Date.now()
    };
    localStorage.setItem('host_setup_place_data', JSON.stringify(placeData));
    
    // Standout data with valid title and description
    const standoutData = {
      photos: ['/placeholder.svg?height=250&width=400', '/placeholder.jpg'],
      title: 'Stunning Mountain View Apartment in Heart of Kathmandu', // 52 characters - valid
      description: 'Experience the best of Kathmandu from this beautifully appointed apartment featuring breathtaking mountain views, modern amenities, and easy access to local attractions. Perfect for families or groups looking for comfort and convenience.', // 248 characters - valid
      selectedAmenities: ['wifi', 'kitchen', 'parking', 'ac', 'tv'],
      pricing: {
        basePrice: '3500',
        cleaningFee: '750',
        securityDeposit: '2000'
      },
      timestamp: Date.now()
    };
    localStorage.setItem('host_setup_standout_data', JSON.stringify(standoutData));
    
    console.log('✅ Valid test data setup complete!');
    console.log('Title length:', standoutData.title.length, 'characters');
    console.log('Description length:', standoutData.description.length, 'characters');
    console.log('User:', testUser);
    
    // Step 4: Navigate to publish page
    console.log('4. Ready to test publish page at: http://localhost:3001/host/setup/publish');
    
    return {
      success: true,
      message: 'Test data setup complete. Navigate to /host/setup/publish to test.',
      data: {
        user: testUser,
        propertyType: 'apartment',
        placeData,
        standoutData
      }
    };
    
  } catch (error) {
    console.error('❌ Error setting up test data:', error);
    return { success: false, error: error.message };
  }
}

// Run the test
testPropertyPublishFlow().then(result => {
  console.log('Test setup result:', result);
});
