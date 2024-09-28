const axios = require('axios');
const jwt = require('jsonwebtoken');
let router = require('express').Router();

let scopes = "identify email guilds";

// Redirect user to Discord for authentication
router.get('/discord', (req, res) => {
    const redirectUri = req.query.redirect || 'https://botcube.vercel.app'; // Default to homepage if no redirect URI is provided
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${process.env.DISCORD_REDIRECT_URI}&response_type=code&scope=${encodeURIComponent(scopes)}&state=${encodeURIComponent(redirectUri)}`;
    res.redirect(discordAuthUrl);
});


// Handle Discord OAuth callback
router.get('/discord/callback', async (req, res) => {
    const redirectUri = decodeURIComponent(req.query.state);
  console.log(req.query);
  if (req?.query?.error) {
    let titleMsg = "Error {}";
    let descriptionMsg = "Somthing Went Wrong! Our Developers will fix it soon.";
    
    if(req.query.error == "access_denied") {
      titleMsg = "Access Denied";
      descriptionMsg = "Authontication Was Cancled, Please Try Again!";
    }
    
    const hostname = redirectUri.split('//')[1].split('/')[0];
    return res.redirect(`https://${hostname}/login-error?title=${titleMsg}&description=${descriptionMsg}}`)
  }
    const code = req.query.code;
  
    try {
      const tokenResponse = await axios.post(
        'https://discord.com/api/oauth2/token',
        new URLSearchParams({
          client_id: process.env.DISCORD_CLIENT_ID,
          client_secret: process.env.DISCORD_CLIENT_SECRET,
          grant_type: 'authorization_code',
          code,
          redirect_uri: process.env.DISCORD_REDIRECT_URI,
          scope: scopes,
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
      const userGuildResponse = await axios.get('https://discord.com/api/users/@me/guilds', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      
      console.log(userResponse.data);
      console.log(userGuildResponse.data);
      const { id, username, discriminator, avatar } = userResponse.data;
  
      let user_Data = { id, username, discriminator, avatar, accessTkn: accessToken, guilds: userGuildResponse.data };
      const jwtToken = jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.cookie('token', jwtToken, {
        //domain: 'bot-list-app-demo.vercel.app',
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,         // Ensure this is only true if using HTTPS
        sameSite: 'None'
      });
      await mdb.set(`user_data_${id}`, user_Data);
  
      res.redirect(redirectUri); // Redirect back to the original page
    } catch (error) {
      console.error(error);
      res.status(500).send('Authentication failed');
    }
  });

module.exports = router;
