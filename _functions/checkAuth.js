const axios = require('axios');
const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.json({ success: false, authenticated: false, error_message: `Not authenticated!` });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!data[decoded.id]) {
            return res.json({ success: false, authenticated: false, error_message: `Not authenticated!` });
        }

        req.user = data[decoded.id];
        next();
    } catch (error) {
        console.error(error);
        res.json({ success: false, authenticated: false, error_message: `Profile not found!` });
    }
};

globalThis.authenticateUser = authenticateUser;