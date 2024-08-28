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


  const { SMTPServer } = require('smtp-server');
const simpleParser = require('mailparser').simpleParser;

// Create a new SMTP server
const server = new SMTPServer({
  // Authentication is optional
  authOptional: true,

  // Handle incoming emails
  onData(stream, session, callback) {
    simpleParser(stream)
      .then(parsed => {
        console.log('Received email:', parsed.subject);
        // You can process the email here
        callback();
      })
      .catch(err => {
        console.error('Error parsing email:', err);
        callback(err);
      });
  },

  // Handle authentication (optional)
  onAuth(auth, session, callback) {
    // Example authentication (plain text username and password)
    if (auth.username === 'user' && auth.password === 'pass') {
      return callback(null, { user: 'user' });
    }
    return callback(new Error('Invalid username or password'));
  }
});

// Start the server
server.listen(25, () => {
  console.log('SMTP server is listening on port 25');
});


})();
