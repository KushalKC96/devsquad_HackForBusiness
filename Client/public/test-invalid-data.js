// Test flow with INVALID data to verify validation
console.log('Starting INVALID data test to verify validation works...');

async function testInvalidDataFlow() {
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
    
    // Step 3: Setup INVALID property data
    console.log('3. Setting up INVALID property data to test validation...');
    
    // Property type
    localStorage.setItem('host_setup_property_type', 'apartment');
    
    // Place data
    const placeData = {
      location: {
        address: '123 Test Street',
        city: 'Kathmandu',
        state: 'Bagmati',
        country: 'Nepal',
        zipCode: '44600'
      },
      guestCounts: {
        guests: 2,
        bedrooms: 1,
        beds: 1,
        bathrooms: 1
      },
      timestamp: Date.now()
    };
    localStorage.setItem('host_setup_place_data', JSON.stringify(placeData));
    
    // Standout data with INVALID title and description
    const standoutData = {
      photos: ['/placeholder.svg?height=250&width=400'],
      title: 'Bad', // 3 characters - INVALID (< 5)
      description: 'Too short', // 9 characters - INVALID (< 10)
      selectedAmenities: ['wifi', 'kitchen'],
      pricing: {
        basePrice: '2000',
        cleaningFee: '500',
        securityDeposit: '1000'
      },
      timestamp: Date.now()
    };
    localStorage.setItem('host_setup_standout_data', JSON.stringify(standoutData));
    
    console.log('❌ INVALID test data setup complete!');
    console.log('Title length:', standoutData.title.length, 'characters (INVALID - should be >= 5)');
    console.log('Description length:', standoutData.description.length, 'characters (INVALID - should be >= 10)');
    console.log('Expected behavior: Publish button should show validation error');
    
    return {
      success: true,
      message: 'Invalid test data setup complete. Should trigger validation errors.',
      data: {
        user: testUser,
        propertyType: 'apartment',
        placeData,
        standoutData,
        validation: {
          titleLength: standoutData.title.length,
          descriptionLength: standoutData.description.length,
          expectedErrors: ['Title too short', 'Description too short']
        }
      }
    };
    
  } catch (error) {
    console.error('❌ Error setting up invalid test data:', error);
    return { success: false, error: error.message };
  }
}

// Run the test
testInvalidDataFlow().then(result => {
  console.log('Invalid data test setup result:', result);
});
