module.exports = {
    "DATABASE_URI": process.env.MONGOLAB_URI,
    "SESSION_SECRET": process.env.SESSION_SECRET,
    "GOOGLE": {
        "clientID": process.env.GOOGLE_CLIENT_ID,
        "clientSecret": process.env.GOOGLE_CLIENT_SECRET,
        "callbackURL": process.env.CALLBACK_URL
    },
    'AWS': {
        'accessKey': process.env.AWS_ACCESS_KEY,
        'secretKey': process.env.AWS_SECRET_KEY
    }
};
