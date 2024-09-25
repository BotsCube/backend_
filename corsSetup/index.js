const cors = require('cors');

function enable(app) {
    if (!app || typeof app.use !== 'function') {
        console.error("Invalid Express app instance");
        return;
    }

    const allowedOrigins = [
        'https://bot-list-app-demo.vercel.app',
        'https://botcube-discord-auth.vercel.app'
    ];

    const corsOptions = {
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true
    };

    app.use(cors(corsOptions));
    console.log("CORS enabled with dynamic origins");
}

module.exports = enable;