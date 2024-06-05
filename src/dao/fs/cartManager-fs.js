const fs = require('fs');

class CartManager {
    constructor(filePath) {
        this.path = filePath;
    }

    async createCart() {
        try {
            const carts = await this.getCartsFromFile();
            const newCart = { cid: this.generateId(carts), products: [] };
            carts.push(newCart);
            await this.saveCartsToFile(carts);
            return newCart.cid;
        } catch (error) {
            throw new Error('Error al crear el carrito: ' + error.message);
        }
    }    

    async getCartById(cartId) {
        try {
            const carts = await this.getCartsFromFile();
            return carts.find(cart => cart.cid === cartId);
        } catch (error) {
            throw new Error('Error al obtener el carrito por ID: ' + error.message);
        }
    }
   
    async addProductToCart(cartId, productId) {
        try {
            const carts = await this.getCartsFromFile();
            const products = await this.getProductsFromFile();
    
            const cartIndex = carts.findIndex(cart => cart.cid === cartId);
            
            if (cartIndex !== -1) {
                const existingProductIndex = carts[cartIndex].products.findIndex(item => item.pid === productId);
    
                if (existingProductIndex !== -1) {
                    carts[cartIndex].products[existingProductIndex].quantity++;
                } else {
                    const productExists = products.some(product => product.id === productId);
                    
                    if (!productExists) {
                        throw new Error('El producto no existe');
                    }
    
                    carts[cartIndex].products.push({ pid: productId, quantity: 1 });
                }
    
                await this.saveCartsToFile(carts);
                return true;
            }
            return false;
        } catch (error) {
            throw error;
        }
    }

async getProductsFromFile() {
    try {
        const productsData = fs.readFileSync('./products.json', 'utf8');
        return JSON.parse(productsData);
    } catch (error) {
        throw new Error('Error al obtener los productos: ' + error.message);
    }
}

    async getCartsFromFile() {
        return new Promise((resolve, reject) => {
            fs.readFile(this.path, 'utf8', (err, data) => {
                if (err) {
                    if (err.code === 'ENOENT') {
                        resolve([]);
                    } else {
                        reject(err);
                    }
                } else {
                    resolve(JSON.parse(data));
                }
            });
        });
    }

    async saveCartsToFile(carts) {
        return new Promise((resolve, reject) => {
            fs.writeFile(this.path, JSON.stringify(carts, null, 2), 'utf8', (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
    
    generateId(carts) {
        const ids = carts.map(cart => cart.cid);
        const maxId = Math.max(...ids, 0);
        return maxId + 1;
    }

    async deleteCart(cid) {
        try {
            const carts = await this.getCartsFromFile();
    
            const cartToDelete = carts.find(cart => cart.cid === cid);
            if (!cartToDelete) {
                throw new Error('El carrito que intentas eliminar no existe');
            }
    
            const updatedCarts = carts.filter(cart => cart.cid !== cid);
    
            await this.saveCartsToFile(updatedCarts);
            return true;
        } catch (error) {
            throw new Error('Error al eliminar el carrito: ' + error.message);
        }
    }

    async deleteProductFromCart(cid, pid) {
        try {
            const carts = await this.getCartsFromFile();
            const cartIndex = carts.findIndex(cart => cart.cid === cid);
            
            if (cartIndex !== -1) {
                const productIndex = carts[cartIndex].products.findIndex(product => product.pid === pid);
                
                if (productIndex !== -1) {
                    if (carts[cartIndex].products[productIndex].quantity > 1) {
                        carts[cartIndex].products[productIndex].quantity--;
                    } else {
                        carts[cartIndex].products.splice(productIndex, 1);
                    }
    
                    await this.saveCartsToFile(carts);
                    return true;
                }
            }
            return false;
        } catch (error) {
            throw new Error('Error al eliminar el producto del carrito: ' + error.message);
        }
    }    
}

module.exports = CartManager;
