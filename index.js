(async () => {
  const express = require('express');
  const cookieParser = require('cookie-parser');

  var connectMdb = require("./DB/Mongo/connect.js");
  var mdbConnected = await connectMdb();

  var mdb = await require("./DB/Mongo/db.js");
  global.mdb = mdb;

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

  app.get('/logout', (req, res) => {
    res.send(true);
  });
})();
