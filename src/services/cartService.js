const CartRepository = require("../repository/cartRepository");
const cartRepository = new CartRepository();
const errorCodes = require('../utils/errorCodes');
const logger = require("../config/logger.js");

exports.createCart = async () => {
    return await cartRepository.createCart();
};

exports.getAllCarts = async () => {
    return await cartRepository.getAllCarts();
};

exports.getCart = async (cartId) => {
    return await cartRepository.getCart(cartId);
};

exports.addToCart = async (cartId, productId, quantity) => {
    return await cartRepository.addToCart(cartId, productId, quantity);
};

exports.updateCartProducts = async (cartId, products) => {
    return await cartRepository.updateCartProducts(cartId, products);
};

exports.updateProductQuantity = async (cartId, productId, quantity) => {
    return await cartRepository.updateProductQuantity(cartId, productId, quantity);
};

exports.emptyCart = async (cartId) => {
    return await cartRepository.emptyCart(cartId);
};

exports.deleteCart = async (cartId) => {
    return await cartRepository.deleteCart(cartId);
};

exports.deleteProductFromCart = async (cartId, productId) => {
    return await cartRepository.deleteProductFromCart(cartId, productId);
};

exports.finalizePurchase = async (cartId, userEmail) => {
    try {
        const result = await cartRepository.finalizePurchase(cartId, userEmail);
        return result;
    } catch (error) {
        logger.error('Error al finalizar la compra:', error);
        throw { code: 'INTERNAL_SERVER_ERROR', original: error };
    }
};