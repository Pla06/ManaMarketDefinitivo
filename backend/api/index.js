// Vercel serverless entry: re-use the Express app from ../index.js
const app = require('../index');

// Export the Express app as the default handler for @vercel/node
module.exports = app;
