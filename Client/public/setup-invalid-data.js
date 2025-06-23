// Setup invalid test data to test validation
console.log('Setting up INVALID test data to test validation...');

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

// Simulate standout data with INVALID title and description
const standoutData = {
  photos: ['/placeholder.svg?height=250&width=400'],
  title: 'Hi', // 2 characters - INVALID (< 5)
  description: 'Short', // 5 characters - INVALID (< 10)
  selectedAmenities: ['wifi', 'kitchen', 'parking'],
  pricing: {
    basePrice: '2500',
    cleaningFee: '500',
    securityDeposit: '1000'
  },
  timestamp: Date.now()
};
localStorage.setItem('host_setup_standout_data', JSON.stringify(standoutData));

console.log('INVALID test data setup complete!');
console.log('Property Type:', localStorage.getItem('host_setup_property_type'));
console.log('Place Data:', JSON.parse(localStorage.getItem('host_setup_place_data')));
console.log('Standout Data:', JSON.parse(localStorage.getItem('host_setup_standout_data')));
console.log('Note: Title is only', JSON.parse(localStorage.getItem('host_setup_standout_data')).title.length, 'characters');
console.log('Note: Description is only', JSON.parse(localStorage.getItem('host_setup_standout_data')).description.length, 'characters');
