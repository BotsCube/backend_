let client_id = process.env.DISCORD_CLIENT_ID;
let client_secret = process.env.DISCORD_CLIENT_SECRET;
let redirect_url = process.env.DISCORD_CLIENT_SECRET;
let scope = 'identify email guilds';


function getAccessToken(code) {
  try {
      const tokenResponse = await axios.post(
        'https://discord.com/api/oauth2/token',
        new URLSearchParams({
          client_id, client_secret,
          grant_type: 'authorization_code',
          code, redirect_uri,
          scope,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
  
      const accessToken = tokenResponse.data.access_token;
  } catch (e) {
    console.log(e);
    return { success: false, error: true };
  }
}