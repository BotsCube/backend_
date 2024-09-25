const jwt = require('jsonwebtoken');

const authenticateUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            console.error("Token not found");
            return res.status(401).json({
                success: false,
                authenticated: false,
                error_message: "Not authenticated!",
                code: "TOKEN_NOT_FOUND"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const dataFromDb = await mdb.get(`user_data_${decoded.id}`);
        
        if (!dataFromDb) {
            console.error("User data not found in database");
            return res.status(401).json({
                success: false,
                authenticated: false,
                error_message: "Not authenticated!",
                code: "USER_NOT_FOUND"
            });
        }

        req.user = dataFromDb;
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(500).json({
            success: false,
            authenticated: false,
            error_message: "Profile not found!",
            code: "AUTH_ERROR"
        });
    }
};

global.authenticateUser = authenticateUser;