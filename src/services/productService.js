const ProductRepositor = require("../repository/productRepository");
const productRepositor = new ProductRepositor();

exports.getProducts = async ({ limit, page, sort, query }) => {
    return await productRepositor.getProducts({ limit, page, sort, query });
};

exports.getProductById = async (productId) => {
    return await productRepositor.getProductById(productId);
};

exports.addProduct = async (productData) => {
    return await productRepositor.addProduct(productData);
};

exports.updateProduct = async (productId, productData) => {
    return await productRepositor.updateProduct(productId, productData);
};

exports.deleteProduct = async (productId) => {
    return await productRepositor.deleteProduct(productId);
};