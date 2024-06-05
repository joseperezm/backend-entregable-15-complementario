const mongoose = require('mongoose');
const { CastError } = require('mongoose').Error;
const Cart = require('../dao/models/carts-mongoose');
const Product = require('../dao/models/products-mongoose');
const Ticket = require('../dao/models/ticket-mongoose');
const errorCodes = require('../utils/errorCodes');
const logger = require("../config/logger");

class CartRepository {
    constructor() {}

    async createCart() {
        try {
            const cart = new Cart();
            await cart.save();
            return cart;
        } catch (error) {
            logger.error('Error creando el carrito:', error);
            const customError = new Error('Error creando el carrito');
            customError.code = 'INTERNAL_SERVER_ERROR';
            throw { code: 'INTERNAL_SERVER_ERROR', original: customError };
        }
    }

    async addToCart(cartId, productId, quantity = 1) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                logger.info('Carrito no encontrado');
                return { success: false, message: 'Carrito no encontrado', cart: null };
            }
    
            const product = await Product.findById(productId);
            if (!product) {
                logger.info('Producto no encontrado');
                return { success: false, message: 'Producto no encontrado', cart: null };
            }
    
            const existingProductIndex = cart.products.findIndex(item => item.productId.equals(productId));
    
            if (existingProductIndex >= 0) {
                cart.products[existingProductIndex].quantity += quantity;
            } else {
                cart.products.push({ productId, quantity });
            }
    
            await cart.save();
            return { success: true, message: 'Producto agregado exitosamente al carrito', cart: cart };
        } catch (error) {
            if (error instanceof CastError) {
                logger.warning('ID incorrecto:', error);
                const customError = new Error('ID de producto o carrito incorrecto');
                customError.code = 'BAD_REQUEST';
                throw { code: 'BAD_REQUEST', original: customError };
            } else {
                logger.error('Error agregando el producto al carrito:', error);
                const customError = new Error('Error agregando el producto al carrito');
                customError.code = 'INTERNAL_SERVER_ERROR';
                throw { code: 'INTERNAL_SERVER_ERROR', original: customError };
            }
        }
    }    

    async getAllCarts() {
        try {
            const carts = await Cart.find(); 
            return carts;
        } catch (error) {
            logger.error('Error obteniendo todos los carritos:', error);
            const customError = new Error('Error obteniendo todos los carritos');
            customError.code = 'INTERNAL_SERVER_ERROR';
            throw { code: 'INTERNAL_SERVER_ERROR', original: customError };
        }
    }     

    async getCart(cartId) {
        try {
            const cart = await Cart.findById(cartId).populate('products.productId');
            if (!cart) {
                logger.info('Carrito no encontrado');
                const customError = new Error('Carrito no encontrado');
                customError.code = 'NOT_FOUND';
                throw { code: 'NOT_FOUND', original: customError };
            }
            return cart;
        } catch (error) {
            if (error instanceof CastError && error.path === '_id') {
                logger.warn('ID incorrecto:', error);
                const customError = new Error('ID incorrecto');
                customError.code = 'BAD_REQUEST';
                throw { code: 'BAD_REQUEST', original: customError };
            } else {
                logger.error('Error obteniendo el carrito:', error);
                const customError = new Error('Error obteniendo el carrito');
                customError.code = 'INTERNAL_SERVER_ERROR';
                throw { code: 'INTERNAL_SERVER_ERROR', original: customError };
            }
        }
    }    

    async deleteCart(cartId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                logger.info('Carrito no encontrado');
                const customError = new Error('Carrito no encontrado');
                customError.code = 'NOT_FOUND';
                throw { code: 'NOT_FOUND', original: customError };
            }
    
            await cart.deleteOne();
            return true;
        } catch (error) {
            if (error instanceof CastError) {
                logger.warn('ID incorrecto:', error);
                const customError = new Error('ID incorrecto');
                customError.code = 'BAD_REQUEST';
                throw { code: 'BAD_REQUEST', original: customError };
            } else {
                logger.error('Error eliminando el carrito:', error);
                const customError = new Error('Error eliminando el carrito');
                customError.code = 'INTERNAL_SERVER_ERROR';
                throw { code: 'INTERNAL_SERVER_ERROR', original: customError };
            }
        }
    }    

    async deleteProductFromCart(cartId, productId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                logger.info('Carrito no encontrado');
                const customError = new Error('Carrito no encontrado');
                customError.code = 'NOT_FOUND';
                throw { code: 'NOT_FOUND', original: customError };
            }
    
            const productIndex = cart.products.findIndex(product => product.productId.equals(productId));
    
            if (productIndex !== -1) {
                if (cart.products[productIndex].quantity > 1) {
                    cart.products[productIndex].quantity -= 1;
                } else {
                    cart.products.splice(productIndex, 1);
                }
    
                await cart.save();
                return { success: true, message: 'Producto eliminado exitosamente', cart: cart };
            } else {
                const customError = new Error('Producto no encontrado');
                customError.code = 'NOT_FOUND';
                throw { code: 'NOT_FOUND', original: customError };
            }
        } catch (error) {
            if (error instanceof CastError) {
                logger.warn('ID incorrecto:', error);
                const customError = new Error('Carrito no encontrado');
                customError.code = 'BAD_REQUEST';
                throw { code: 'BAD_REQUEST', original: customError };
            } else {
                logger.error('Error eliminando producto del carrito:', error);
                const customError = new Error('Error eliminando producto del carrito');
                customError.code = 'INTERNAL_SERVER_ERROR';
                throw { code: 'INTERNAL_SERVER_ERROR', original: customError };
            }
        }
    }    

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const cart = await this.getCart(cartId);
            if (!cart) {
                const customError = new Error('Carrito no encontrado');
                customError.code = 'NOT_FOUND';
                throw { code: 'NOT_FOUND', original: customError };
            }
    
            const productIndex = cart.products.findIndex(p => p.productId.equals(productId));
            if (productIndex === -1) {
                const customError = new Error('Producto no encontrado en el carrito');
                customError.code = 'NOT_FOUND';
                throw { code: 'NOT_FOUND', original: customError };
            }
    
            if (quantity <= 0) {
                cart.products.splice(productIndex, 1);
            } else {
                cart.products[productIndex].quantity = quantity;
            }
    
            await cart.save();
            return { success: true, cart: cart };
        } catch (error) {
            if (error instanceof CastError) {
                logger.warn('ID incorrecto:', error);
                const customError = new Error('Carrito no encontrado');
                customError.code = 'BAD_REQUEST';
                throw { code: 'BAD_REQUEST', original: customError };
            } else {
                logger.error('Error actualizando cantidad de productos:', error);
                const customError = new Error('Error actualizando cantidad de productos');
                customError.code = 'INTERNAL_SERVER_ERROR';
                throw { code: 'INTERNAL_SERVER_ERROR', original: customError };
            }
        }
    }    

    async updateCartProducts(cartId, products) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                const customError = new Error('Carrito no encontrado');
                customError.code = 'NOT_FOUND';
                throw { code: 'NOT_FOUND', original: customError };
            }
    
            const updatedProducts = products.map(product => ({
                productId: new mongoose.Types.ObjectId(product.productId),
                quantity: Number(product.quantity)
            }));
    
            cart.products = updatedProducts;
    
            await cart.save();
            return { success: true, cart: cart };
        } catch (error) {
            if (error instanceof CastError) {
                logger.warn('ID incorrecto:', error);
                const customError = new Error('Carrito no encontrado');
                customError.code = 'BAD_REQUEST';
                throw { code: 'BAD_REQUEST', original: customError };
            } else {
                logger.error('Error actualizando el carrito con nuevos productos:', error);
                const customError = new Error('Error actualizando el carrito con nuevos productos');
                customError.code = 'INTERNAL_SERVER_ERROR';
                throw { code: 'INTERNAL_SERVER_ERROR', original: customError };
            }
        }
    }    

    async emptyCart(cartId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                logger.info('Carrito no encontrado');
                const customError = new Error('Carrito no encontrado');
                customError.code = 'NOT_FOUND';
                throw { code: 'NOT_FOUND', original: customError };
            }
    
            cart.products = [];
    
            await cart.save();
            return { success: true, message: 'Carrito vaciado exitosamente', cart: cart };
        } catch (error) {
            if (error instanceof CastError) {
                logger.warn('ID incorrecto:', error);
                const customError = new Error('ID incorrecto');
                customError.code = 'BAD_REQUEST';
                throw { code: 'BAD_REQUEST', original: customError };
            } else {
                logger.error('Error vaciando el carrito:', error);
                const customError = new Error('Error vaciando el carrito');
                customError.code = 'INTERNAL_SERVER_ERROR';
                throw { code: 'INTERNAL_SERVER_ERROR', original: customError };
            }
        }
    }    

    async finalizePurchase(cartId, userEmail) {
        try {
            const cart = await this.getCart(cartId);
            if (!cart) {
                const customError = new Error('Carrito no encontrado');
                customError.code = 'NOT_FOUND';
                throw { code: 'NOT_FOUND', original: customError };
            }
    
            let totalAmount = 0;
            let failedProducts = [];
            const updates = [];
            let newTicket = null;
    
            for (const item of cart.products) {
                const product = await Product.findById(item.productId);
                if (product && product.stock >= item.quantity) {
                    product.stock -= item.quantity;
                    totalAmount += item.quantity * product.price;
                    updates.push(product.save());
                } else {
                    failedProducts.push({ id: item.productId.toString(), title: product.title, _id: product._id });
                }
            }
    
            await Promise.all(updates);
    
            if (totalAmount > 0) {
                newTicket = new Ticket({
                    code: Math.random().toString(36).substr(2, 9),
                    purchase_datetime: new Date(),
                    amount: totalAmount,
                    purchaser: userEmail
                });
                await newTicket.save();
            }
    
            cart.products = cart.products.filter(item => failedProducts.some(failedProd => failedProd.id === item.productId.toString()));
            await cart.save();
    
            return {
                totalAmount,
                failedProducts,
                message: newTicket ? "Compra finalizada con éxito" : "Compra parcialmente exitosa",
                ticketId: newTicket ? newTicket._id : null
            };
        } catch (error) {
            logger.error('Error finalizando la compra:', error);
            const customError = new Error('Error finalizando la compra');
            customError.code = 'INTERNAL_SERVER_ERROR';
            throw { code: 'INTERNAL_SERVER_ERROR', original: customError };
        }
    }    
    
}

module.exports = CartRepository;
