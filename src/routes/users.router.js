const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const redirectIfNotLoggedInApi = require('../middleware/auth.js');
const authorizeApi = require('../middleware/authorizeApi.js');

router.put('/premium/:uid', authorizeApi('admin'), redirectIfNotLoggedInApi, userController.changeUserRole);

module.exports = router;
