const User = require('../models/user.model');
const asyncHandler = require('express-async-handler');
const argon2 = require('argon2');
const Blacklist = require('../models/blacklist.model');

// Registro de un nuevo usuario
const registerUser = asyncHandler(async (req, res) => {
    const { user } = req.body;

    // Confirmar datos
    if (!user || !user.email || !user.username || !user.password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    // Comprobar si el nombre de usuario ya existe
    const existingUsername = await User.findOne({ username: user.username });
    if (existingUsername) {
        return res.status(409).json({ message: "This username already exists." });
    }

    // Comprobar si el correo electrónico ya existe
    const existingEmail = await User.findOne({ email: user.email });
    if (existingEmail) {
        return res.status(409).json({ message: "This email already exists." });
    }


    // Hashear la contraseña
    const hashedPwd = await argon2.hash(user.password);

    const userObject = {
        "username": user.username,
        "password": hashedPwd,
        "email": user.email
    };

    const createdUser = await User.create(userObject);

    if (createdUser) {
        res.status(201).json({
            message: "User successfully registered"
        });
    } else {
        res.status(422).json({
            errors: {
                body: "Could not register a user"
            }
        });
    }
});

// Iniciar sesión de un usuario existente
const userLogin = asyncHandler(async (req, res) => {
    const { user } = req.body;

    // Confirmar datos
    if (!user || !user.email || !user.password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const loginUser = await User.findOne({ email: user.email }).exec();

    if (!loginUser) {
        return res.status(404).json({ message: "Usser not found." });
    }

    const match = await argon2.verify(loginUser.password, user.password);

    if (!match) {
        return res.status(401).json({ message: 'Unauthorized: wrong password.' });
    }

    // Si el usuario tiene un refresh token existente, añadirlo a la blacklist si no está ya
    if (loginUser.refresh_token) {
        const tokenExists = await Blacklist.findOne({ token: loginUser.refresh_token }).exec();
        if (!tokenExists) {
            await Blacklist.create({ token: loginUser.refresh_token, userId: loginUser._id });
        }
    }

    // Utilizar toUserResponse para generar los tokens y devolver al cliente
    const response = loginUser.toUserResponse();
    res.status(200).json({
        user: response
    });
});

// Obtener el usuario actual
const getCurrentUser = asyncHandler(async (req, res) => {
    const email = req.userEmail;

    const user = await User.findOne({ email }).exec();

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
        user: user.toUserDetails()
    });
});


const getProfileUser = asyncHandler(async (req, res) => {
    const email = req.userEmail;

    const user = await User.findOne({ email }).exec();

    if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const profileUser = await user.toProfileUser();

    res.status(200).json({
        user: profileUser,
    });
});

// Actualizar usuario
const updateUser = asyncHandler(async (req, res) => {
    const { user } = req.body;

    // Confirmar datos
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
        user: target.toUserDetails()
    });
});

module.exports = {
    registerUser,
    getCurrentUser,
    userLogin,
    updateUser,
    getProfileUser
};
