const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

let enableCors = require('./corsSetup/index');
let setupRoutes = require('./setupRoutes');

require('./_functions/checkAuth');

const app = express();
app.use(cookieParser());
enableCors(app);

// setup external routes
setupRoutes(app);

// Start the server
app.listen(5000, () => {
  console.log('Server running on .');
});
