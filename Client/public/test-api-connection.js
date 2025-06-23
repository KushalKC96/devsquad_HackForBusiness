// Test API connection from frontend
console.log('Testing API connection...');

fetch('http://localhost:5000/api/properties?limit=5')
  .then(response => response.json())
  .then(data => {
    console.log('API Response:', data);
    console.log('Number of properties:', data.data.properties.length);
    console.log('First property:', data.data.properties[0]);
  })
  .catch(error => {
    console.error('API Error:', error);
  });
