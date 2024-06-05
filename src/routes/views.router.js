const express = require("express");
const router = express.Router();

const productsViewController = require("../controllers/productsViewController");
const cartsViewController = require("../controllers/cartsViewController");
const authViewController = require("../controllers/authViewController");
const chatViewController = require("../controllers/chatViewController");
const realTimeProductsViewController = require("../controllers/realTimeProductsViewController");
const errorController = require('../controllers/errorController');
const authorize = require('../middleware/authorize.js');

const redirectIfNotLoggedIn = require('../middleware/auth.js');
const redirectIfLoggedIn = require('../middleware/loggedIn.js');

router.get("/", redirectIfNotLoggedIn, (req, res) => res.render("index"));
router.get("/products", redirectIfNotLoggedIn, productsViewController.index);
router.get("/carts", authorize('admin'), redirectIfNotLoggedIn, cartsViewController.showCarts);
router.get("/carts/:cid", redirectIfNotLoggedIn, cartsViewController.showCart);

router.get('/login', redirectIfLoggedIn, authViewController.showLogin);
router.get("/register", redirectIfLoggedIn, authViewController.showRegister);
router.get('/profile', redirectIfNotLoggedIn, authViewController.showProfile);
router.get("/chat", authorize(['user', 'premium']), redirectIfNotLoggedIn, chatViewController.showChat);
router.get("/realtimeproducts",authorize(['admin', 'premium']), redirectIfNotLoggedIn, realTimeProductsViewController.showRealTimeProducts);
router.get("/mockingproducts", redirectIfNotLoggedIn, productsViewController.showMockProducts);

router.get('/forgot-password', authViewController.showForgotPassword);
router.get('/reset-password/:token', authViewController.showResetPasswordForm);

router.get('/error', redirectIfNotLoggedIn, errorController.showError);

module.exports = router;