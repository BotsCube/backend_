const jwt = require('jsonwebtoken');

const authenticateUser = async(req, res, next) => {
    try {
        const token = req.cookies.token;
        console.log(token);
        if (!token) {
            return res.json({ success: false, authenticated: false, error_message: `Not authenticated!` });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        let dataFromDb = await mdb.get(`user_data_${decoded.id}`);
        if (!dataFromDb) {
            return res.json({ success: false, authenticated: false, error_message: `Not authenticated!` });
        }

        req.user = dataFromDb;
        next();
    } catch (error) {
        console.error(error);
        res.json({ success: false, authenticated: false, error_message: `Profile not found!` });
    }
};

global.authenticateUser = authenticateUser;
