const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');

var data = {};

const authenticateUser = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res/*.status(401)*/.json({ success: false, authenticated: false, error_message: `Not authenticated!`});
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!data[decoded.id]) {
      return res/*.status(401)*/.json({ success: false, authenticated: false, error_message: `Not authenticated!`});
    }

    req.user = data[decoded.id];
    next();
  } catch (error) {
    console.error(error);
    res/*.status(500)*/.json({ success: false, authenticated: false, error_message: `Profile not found!`});
  }
};

global.authenticateUser = authenticateUser;

const app = express();
app.use(cookieParser());

// Enable CORS with credentials
app.use(cors({
  origin: 'https://bot-list-app-demo.vercel.app', //'https://botcube-discord-auth.vercel.app',  // Frontend origin
  credentials: true,                 // Allow cookies to be sent
}));

// setup external routes
app.use('/user', require('./routes/user'));

// Redirect user to Discord for authentication
app.get('/auth/discord', (req, res) => {
  const redirectUri = req.query.redirect || 'https://botcube.vercel.app'; // Default to homepage if no redirect URI is provided
  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${process.env.DISCORD_REDIRECT_URI}&response_type=code&scope=identify&state=${encodeURIComponent(redirectUri)}`;
  res.redirect(discordAuthUrl);
});

// Handle Discord OAuth callback
app.get('/auth/discord/callback', async (req, res) => {
  const code = req.query.code;
  const redirectUri = decodeURIComponent(req.query.state); // Original page to redirect to after login

  try {
    const tokenResponse = await axios.post(
      'https://discord.com/api/oauth2/token',
      new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.DISCORD_REDIRECT_URI,
        scope: 'identify',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(userResponse.data);
    const { id, username, discriminator, avatar } = userResponse.data;

    data[id] = { id, username, discriminator, avatar, accessTkn: accessToken };
    const jwtToken = jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', jwtToken, {
     // domain: 'botcube-discord-auth.vercel.app',
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,         // Ensure this is only true if using HTTPS
      sameSite: 'None'
    });

    res.redirect(redirectUri); // Redirect back to the original page
  } catch (error) {
    console.error(error);
    res.status(500).send('Authentication failed');
  }
});

// Protected route to get user profile
app.get('/profile', authenticateUser, async (req, res) => {
  res.json(req.user);
});

//api to fet details of a bot
app.get('/get/bot/details', authenticateUser, async (req, res) => {
  try {
    if (!req || !req.query || !req.query.appId || req.query.appId.trim() === "") {
      return res.json({ success: false, appIdProvided: false, error_message: "Application Id is not provided" });
    }

    let appId = req.query.appId;

    try {
      let botData = await axios.get(`https://discord.com/api/v10/applications/${appId}/rpc`);
      res.json(botData.data);
    } catch (err) {
      console.log(err);
      res.json({ success: false, error_message: "Error while fetching Bot" });
    }

  } catch (er) {
    console.log(er);
    res.json({ success: false, error_message: "Something went wrong" });
  }
});


app.get('/user/@me', async(req, res) => {
  res.json({
    success: true,
    authorised: true,
    user: {
      id: 1010101010,
      name: "test uesr",
      email: "test@email.tdl",
      avatar: "",
    }
  });
});

// Start the server
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
