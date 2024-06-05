const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const redirectIfNotLoggedIn = require('../middleware/auth.js');
const redirectIfLoggedIn = require('../middleware/loggedIn.js');
const redirectIfLoggedInApi = require('../middleware/loggedInApi.js');

router.get('/register', redirectIfLoggedInApi, authController.registrationInstructions);

router.post('/register', redirectIfLoggedInApi, authController.register);

router.get('/login', redirectIfLoggedIn, authController.loginInstructions);

router.post('/login', redirectIfLoggedIn, authController.login);

router.get("/logout", redirectIfNotLoggedIn, authController.logout);

router.get("/auth/github", authController.githubAuth);
router.get("/auth/github/callback", authController.githubCallback);

router.get('/auth/google', authController.googleAuth);
router.get("/auth/google/callback", authController.googleCallback);

router.get('/current', redirectIfNotLoggedIn, authController.currentSession);

router.post('/request-reset-password', authController.requestResetPassword);
router.post('/reset-password/:token', authController.resetPassword);

module.exports = router;