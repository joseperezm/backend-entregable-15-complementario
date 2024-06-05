const express = require("express");
const router = express.Router();
const productsController = require('../controllers/productsController');
const redirectIfNotLoggedInApi = require('../middleware/authApi.js');
const authorizeApi = require('../middleware/authorizeApi.js');

router.get('/products', redirectIfNotLoggedInApi, productsController.getProducts);
router.get('/products/:pid', redirectIfNotLoggedInApi, productsController.getProductById);
router.get('/mockingproducts', productsController.mockProducts);
router.post('/products', authorizeApi(['admin', 'premium']), redirectIfNotLoggedInApi, productsController.addProduct);
router.put('/products/:id', authorizeApi(['admin', 'premium']), redirectIfNotLoggedInApi, productsController.updateProduct);
router.delete('/products/:pid', authorizeApi(['admin', 'premium']), redirectIfNotLoggedInApi, productsController.deleteProduct);

module.exports = router;