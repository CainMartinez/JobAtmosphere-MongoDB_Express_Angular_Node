const RefreshToken = require('../models/refreshToken.model');
const BlacklistToken = require('../models/blacklistToken.model');
const User = require('../models/user.model');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10s' });
};

const generateRefreshToken = (userId) => {
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    return refreshToken;
};

const saveRefreshToken = async (userId, token) => {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await RefreshToken.create({ token, userId, expiresAt });
};

const blacklistToken = async (token) => {
    const decoded = jwt.decode(token);
    const expiresAt = new Date(decoded.exp * 1000);
    await BlacklistToken.create({ token, expiresAt });
};

const refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) return res.status(401).send('Refresh token required');

    const blacklistedToken = await BlacklistToken.findOne({ token: refreshToken }).exec();
    if (blacklistedToken) {
        return res.status(403).send('Invalid token, blacklist');
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const userId = decoded.userId;

        const storedToken = await RefreshToken.findOne({ token: refreshToken, userId }).exec();
        if (!storedToken) {
            return res.status(403).send('Invalid refresh token');
        }

        // Verificar si el Refresh Token ha expirado
        if (decoded.exp * 1000 < Date.now()) {
            return res.status(403).send('Refresh token has expired');
        }

        // Buscar al usuario en la base de datos
        const user = await User.findById(userId).exec();
        if (!user) {
            return res.status(404).send('User Not Found');
        }

        await blacklistToken(refreshToken);
        await RefreshToken.deleteOne({ token: refreshToken }).exec();

        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(userId);
        await saveRefreshToken(userId, newRefreshToken);

        res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (err) {
        res.status(403).send('Invalid or expired refresh token');
    }
});

module.exports = {
    refreshToken
};