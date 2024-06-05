const cartService = require('../services/cartService');
const errorCodes = require('../utils/errorCodes');
const { CastError } = require('mongoose').Error;
const logger = require("../config/logger");

exports.showCarts = async (req, res, next) => {
    try {
        const carts = await cartService.getAllCarts();
        const cartsObjects = carts.map(cart => cart.toObject ? cart.toObject() : cart);
        res.render('carts', { carts: cartsObjects });
        logger.debug("Carritos obtenidos exitosamente y enviados a la vista.");
    } catch (error) {
        logger.error("Error al obtener todos los carritos", error);
        next({ code: 'INTERNAL_SERVER_ERROR', original: error });
    }
};


exports.showCart = async (req, res, next) => {
    const { cid } = req.params;

    try {
        const cart = await cartService.getCart(cid);
        if (cart) {
            const cartObject = cart.toObject ? cart.toObject() : cart;
            res.render('cart', { cart: cartObject });
        } else {
            next({ code: 'NOT_FOUND', message: "Carrito no encontrado" });
            logger.warn(`Carrito con ID ${cid} no encontrado.`);
        }
    } catch (error) {
        if (error instanceof CastError) {
            logger.warn(`Error de casteo con ID ${cid}: ${error.message}`);
            return res.status(400).json({ message: "ID de carrito no válido" });
        }
        logger.error("Error al obtener el carrito por ID", error);
        next({ code: 'INTERNAL_SERVER_ERROR', original: error });
    }
};