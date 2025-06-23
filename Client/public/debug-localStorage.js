// Check localStorage data
console.log('=== Checking localStorage Host Setup Data ===');

const keys = ['host_setup_property_type', 'host_setup_place_data', 'host_setup_standout_data'];

keys.forEach(key => {
  const data = localStorage.getItem(key);
  console.log(`${key}:`, data ? JSON.parse(data) : 'null');
});

// Clear all setup data if needed
// localStorage.removeItem('host_setup_property_type');
// localStorage.removeItem('host_setup_place_data'); 
// localStorage.removeItem('host_setup_standout_data');
// console.log('Cleared all setup data');
