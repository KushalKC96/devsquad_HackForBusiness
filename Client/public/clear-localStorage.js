// Clear all localStorage data for host setup
console.log('Clearing all host setup localStorage data...');

const keysToRemove = [];
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key && key.startsWith('host_setup_')) {
    keysToRemove.push(key);
  }
}

keysToRemove.forEach(key => {
  console.log('Removing:', key);
  localStorage.removeItem(key);
});

console.log('localStorage cleared!');
