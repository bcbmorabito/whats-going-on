const { handler } = require('./dist/index.js'); 

(async () => {
  try {
    await handler();
    console.log('Load function executed successfully.');
  } catch (e) {
    console.error('Error executing load function:', e);
  }
})();
