const cors = require('cors');

function enable(app) {
    if(!app) return;
    app.use(cors({
        origin: 'https://bot-list-app-demo.vercel.app', //'https://botcube-discord-auth.vercel.app',  // Frontend origin
        credentials: true,  // Allow cookies to be sent
    }));
    console.log(`CORS enabled`);
};

module.exports = enable;