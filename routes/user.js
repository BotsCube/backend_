let express = require('express');
let router = express.Router();

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

module.exports = router;
