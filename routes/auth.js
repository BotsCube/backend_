const axios = require('axios');
const jwt = require('jsonwebtoken');
let router = require('express').Router();

var data = {};

// Redirect user to Discord for authentication
router.get('/discord', (req, res) => {
    const redirectUri = req.query.redirect || 'https://botcube.vercel.app'; // Default to homepage if no redirect URI is provided
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${process.env.DISCORD_REDIRECT_URI}&response_type=code&scope=identify&state=${encodeURIComponent(redirectUri)}`;
    res.redirect(discordAuthUrl);
});

// Handle Discord OAuth callback
router.get('/discord/callback', async (req, res) => {
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

module.exports = router;
