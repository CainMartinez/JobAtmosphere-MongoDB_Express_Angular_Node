const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const verifyJWT = require('../middleware/verifyJWT');
const verifyJWTOptional = require('../middleware/verifyJWTOptional');

// Authentication
router.post('/users/login', userController.userLogin);

// Registration
router.post('/users/register', userController.registerUser);

// Get Current User
router.get('/user', verifyJWT, userController.getCurrentUser);

router.get('/user/profile:id', verifyJWTOptional, userController.getCurrentUser);

// Update User
router.put('/user', verifyJWT, userController.updateUser);

module.exports = router;