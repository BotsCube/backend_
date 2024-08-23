let router = require('express').Router();

router.get('/user/@me', async (req, res) => {
    res.json({
        success: true,
        authorised: true,
        user: {
            id: 1010101010,
            name: "test uesr",
            email: "test@email.tdl",
            avatar: "https://i.pravatar.cc/",
        }
    });
});

module.exports = router;