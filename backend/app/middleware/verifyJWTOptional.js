const jwt = require('jsonwebtoken');

const verifyJWTOptional = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ') || !authHeader.split(' ')[1].length) {
        req.loggedin = false;
        return next();
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Forbidden' });
            }
            req.loggedin = true;
            req.userId = decoded.id;
            req.userEmail = decoded.email;
            next();
        }
    );
};

module.exports = verifyJWTOptional;