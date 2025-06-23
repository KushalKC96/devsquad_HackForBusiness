// Setup test data for host setup flow
console.log('Setting up test data for host setup flow...');

// Simulate property type selection
localStorage.setItem('host_setup_property_type', 'apartment');

// Simulate place data
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

// Simulate standout data with valid title and description
const standoutData = {
  photos: ['/placeholder.svg?height=250&width=400'],
  title: 'Beautiful Mountain View Apartment', // 33 characters - valid (>= 5)
  description: 'A cozy apartment with stunning mountain views and modern amenities. Perfect for travelers.', // 96 characters - valid (>= 10)
  selectedAmenities: ['wifi', 'kitchen', 'parking'],
  pricing: {
    basePrice: '2500',
    cleaningFee: '500',
    securityDeposit: '1000'
  },
  timestamp: Date.now()
};
localStorage.setItem('host_setup_standout_data', JSON.stringify(standoutData));

console.log('Test data setup complete!');
console.log('Property Type:', localStorage.getItem('host_setup_property_type'));
console.log('Place Data:', JSON.parse(localStorage.getItem('host_setup_place_data')));
console.log('Standout Data:', JSON.parse(localStorage.getItem('host_setup_standout_data')));
