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
    const activityResponse = await axios.post(
        'https://discord.com/api/v10/users/@me/rpc',
        {
          cmd: "SET_ACTIVITY",
          args: {
            pid: process.pid,
            activity: {
              state: "NodeJs",
              details: "NodeJs",
              timestamps: { start: Date.now() },
              // No assets included here
            },
          },
          nonce: "some-unique-string"
        },
        {
          headers: {
            Authorization: `Bearer ${nnnaccessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      res.send('Presence updated without large image!');
      console.log(activityResponse);
      
      } catch (er) {
      console.log(er);
      res.send('failed');
      }
      
});

module.exports = router;
