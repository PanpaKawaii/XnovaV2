// Test file to verify dateUtils exports
console.log('Before import...');
import('./app/hooks/dateUtils.js')
  .then(module => {
    console.log('Import successful!');
    console.log('Module:', module);
    console.log('Keys:', Object.keys(module));
  })
  .catch(error => {
    console.error('Import error:', error);
  });
