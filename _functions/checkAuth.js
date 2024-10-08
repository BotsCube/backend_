const jwt = require('jsonwebtoken');

const authenticateUser = async(req, res, next) => {
    try {
        const token = req.cookies.token;
        console.log(token);
        if (!token) {
            console.log("!token");
            return res.json({ success: false, authenticated: false, error_message: `Not authenticated!`, '!': '!tkn' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        let dataFromDb = await mdb.get(`user_data_${decoded.id}`);
        if (!dataFromDb) {
            console.log("!found from db");
            return res.json({ success: false, authenticated: false, error_message: `Not authenticated!`, '!': 'ntFndInDb' });
        }

        req.user = dataFromDb;
        next();
    } catch (error) {
        console.log("errrrrr");
        console.error(error);
        
        res.json({ success: false, authenticated: false, error_message: `Profile not found!`, '!': 'otrErr' });
    }
};

global.authenticateUser = authenticateUser;
