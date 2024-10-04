const User = require('../models/user.model');
const asyncHandler = require('express-async-handler');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const REFRESH_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET;

let blacklistedTokens = [];

const generateRefreshToken = (user) => {
    return jwt.sign({ id: user._id, username: user.username }, REFRESH_SECRET_KEY, { expiresIn: '7d' });
};

const registerUser = asyncHandler(async (req, res) => {
    const { user } = req.body;

    if (!user || !user.email || !user.username || !user.password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.find({ $or: [{ email: user.email }, { username: user.username }] });
    if (existingUser.length > 0) {
        return res.status(400).json({ message: 'Email or username already in use' });
    }

    const hashedPwd = await argon2.hash(user.password);

    const userObject = {
        "username": user.username,
        "password": hashedPwd,
        "email": user.email
    };

    const createdUser = await User.create(userObject);

    if (createdUser) {
        res.status(201).json({
            user: createdUser.toUserResponse()
        });
    } else {
        res.status(422).json({
            errors: {
                body: "Unable to register a user"
            }
        });
    }
});

const getCurrentUser = asyncHandler(async (req, res) => {
    const email = req.userEmail;

    const user = await User.findOne({ email }).exec();

    if (!user) {
        return res.status(404).json({ message: "User Not Found" });
    }

    res.status(200).json({
        user: user.toUserResponse()
    });
});

const userLogin = asyncHandler(async (req, res) => {
    const { user } = req.body;

    if (!user || !user.email || !user.password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const loginUser = await User.findOne({ email: user.email }).exec();

    if (!loginUser) {
        return res.status(404).json({ message: "User Not Found" });
    }

    const match = await argon2.verify(loginUser.password, user.password);

    if (!match) return res.status(401).json({ message: 'Unauthorized: Wrong password' });

    const refreshToken = generateRefreshToken(loginUser);
    loginUser.refreshToken = refreshToken;
    await loginUser.save();

    res.status(200).json({
        refreshToken,
        user: loginUser.toUserResponse()
    });
});

const refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) return res.status(401).send('Token de refresh requerido');

    if (blacklistedTokens.includes(refreshToken)) {
        return res.status(403).send('Refresh token inválido');
    }

    try {
        const userData = jwt.verify(refreshToken, REFRESH_SECRET_KEY);
        const user = await User.findById(userData.id).exec();

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).send('Refresh token inválido');
        }

        blacklistedTokens.push(refreshToken);

        const newRefreshToken = generateRefreshToken(user);
        user.refreshToken = newRefreshToken;
        await user.save();

        res.json({ refreshToken: newRefreshToken });
    } catch (err) {
        res.status(403).send('Token de refresh inválido o expirado');
    }
});

const updateUser = asyncHandler(async (req, res) => {
    const { user } = req.body;

    if (!user) {
        return res.status(400).json({ message: "Required a User object" });
    }

    const email = req.userEmail;

    const target = await User.findOne({ email }).exec();

    if (user.email) {
        target.email = user.email;
    }
    if (user.username) {
        target.username = user.username;
    }
    if (user.password) {
        const hashedPwd = await argon2.hash(user.password);
        target.password = hashedPwd;
    }
    if (typeof user.image !== 'undefined') {
        target.image = user.image;
    }
    if (typeof user.bio !== 'undefined') {
        target.bio = user.bio;
    }
    await target.save();

    return res.status(200).json({
        user: target.toUserResponse()
    });
});

module.exports = {
    registerUser,
    getCurrentUser,
    userLogin,
    updateUser,
    refreshToken
};