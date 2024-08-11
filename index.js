const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');

let data = {};

const app = express();
app.use(cookieParser());

// Enable CORS with credentials
app.use(cors({
  origin: "*", //'https://botcube-discord-auth.vercel.app',  // Frontend origin
  credentials: true,                 // Allow cookies to be sent
}));

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

    const { id, username, discriminator, avatar } = userResponse.data;

    data[id] = { id, username, discriminator, avatar };
    const jwtToken = jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: '1m' });
    console.log(jwtToken);
    // Set the cookie with appropriate flags for cross-domain
    res.cookie('token', jwtToken, {
    //  domain: 'botcube-discord-auth.vercel.app',
      maxAge: 30 * 24 * 60 * 60 * 1000,
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
app.get('/profile', async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send('Not authenticated');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(!data[decoded.id]){
      return res.status(401).send('Not authenticated');
    }
    res.json(data[decoded.id]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching profile');
  }
});

// Start the server
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
