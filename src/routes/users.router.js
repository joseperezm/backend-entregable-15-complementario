const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const redirectIfNotLoggedInApi = require('../middleware/auth.js');
const authorizeApi = require('../middleware/authorizeApi.js');
const upload = require('../middleware/multer');

router.put('/premium/:uid', authorizeApi('admin'), redirectIfNotLoggedInApi, userController.changeUserRole);
router.post('/:uid/documents', upload.array('documents'), redirectIfNotLoggedInApi, userController.uploadDocuments);

module.exports = router;
