let express = require('express');
let router = express.Router();
let axios = require('axios');

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

router.get('/setup', authenticateUser, async(req, res) => {
  let { accessTkn } = req.user;
  let nnnaccessToken = accessTkn;
  
    try {
      // Update activity status
      const activityStatus = 'Playing a game';
      const activityData = {
        type: 0,
        name: activityStatus,
        url: null
      };
      // 'Content-Type': 'application/json',
      let activityResponse = await axios.patch(`https://discord.com/api/users/@me/activity`, activityData, {
    headers: {
      Authorization: `Bearer ${nnnaccessToken}`
    }
  });
      res.send('Presence updated without large image!');
      console.log(activityResponse);
      
      } catch (er) {
      console.log(er);
      res.send('failed');
      }
      
});

module.exports = router;
