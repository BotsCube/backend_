
const express = require('express');
const router = express.Router();

router.get('/user/@me', async (req, res) => {
    try {
        res.json({
            success: true,
            authorised: true,
            user: {
                id: 1010101010,
                name: "test user", // Corrected typo
                email: "test@email.tdl",
                avatar: "https://i.pravatar.cc/",
            }
        });
    } catch (error) {
        console.error('Error handling /user/@me route:', error);
        res.status(500).json({
            success: false,
            authorised: false,
            error: 'Internal Server Error'
        });
    }
});

module.exports = router;