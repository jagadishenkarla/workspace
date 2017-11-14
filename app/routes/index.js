// routes/index.js
const noteRoutes = require('./market_routes');
module.exports = function(app, db) {
  noteRoutes(app, db);
};