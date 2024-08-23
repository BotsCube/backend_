function setup(app) {
    if (!app) return;

    app.use('/user', require('./routes/user'));
    app.use('/auth', require('./routes/auth'));
    app.use('/dummy', require('./routes/dummy'));

    console.log('Routes setup successfull');
};

module.exports = setup;