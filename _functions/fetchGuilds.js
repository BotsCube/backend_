async function fetchFuilds(accessToken) {
        const userGuildResponse = await axios.get('https://discord.com/api/users/@me/guilds', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      return userGuildResponse.data;
}