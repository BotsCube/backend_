let express = require('express');
let router = express.Router();
let axios = require('axios');
let tkn = process.env.ttkknn;

router.get('/@me', authenticateUser, async (req, res) => {

    let { id, username, discriminator, avatar, accessTkn } = req.user;

    res.json({
        success: true,
        authenticated: true,
        userData: {
            id,
            username,
            discriminator,
            avatar
        }
    });
});

router.get('/join', authenticateUser, async(req, res) => {
  let { accessTkn } = req.user;
  let nnnaccessToken = accessTkn;
  
    try {
      let activityResponse = await axios.put(`https://discord.com/api/v10/guilds/1273219139137437706/members/${userId}`, {
        access_token: nnnaccessToken
    }, {
        headers: {
            Authorization: `Bot ${tkn}`
        }
    });
      res.send('jpines sufgudsif');
      console.log(activityResponse);
      
      } catch (er) {
      console.log(er);
      res.send('failed');
      }
      
});

module.exports = router;
