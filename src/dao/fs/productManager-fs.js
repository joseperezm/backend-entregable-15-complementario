const fs = require('fs');

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
    }

    async addProduct(newProduct) {
        try {
            const products = await this.getProductsFromFile();
            newProduct.id = this.generateId(products);
            products.push(newProduct);
            await this.saveProductsToFile(products);
            return newProduct.id;
        } catch (error) {
            throw new Error('Error al agregar el producto: ' + error.message);
        }
    }

    async getProducts() {
        try {
            const products = await this.getProductsFromFile();
            return products;
        } catch (error) {
            throw new Error('Error al obtener los productos: ' + error.message);
        }
    }

    async getProductById(id) {
        try {
            const products = await this.getProductsFromFile();
            return products.find(product => product.id === id);
        } catch (error) {
            throw new Error('Error al obtener el producto por ID: ' + error.message);
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            let products = await this.getProductsFromFile();
            const productIndex = products.findIndex(product => product.id === id);
            if (productIndex !== -1) {
                products[productIndex] = { ...products[productIndex], ...updatedFields };
                await this.saveProductsToFile(products);
                return true;
            }
            return false;
        } catch (error) {
            throw new Error('Error al actualizar el producto: ' + error.message);
        }
    }

    async deleteProduct(id) {
        try {
            let products = await this.getProductsFromFile();
            const initialLength = products.length;
    
            products = products.filter(product => product.id !== id);
    
            if (products.length !== initialLength) {
                await this.saveProductsToFile(products);
                return true;
            }
    
            return false;
        } catch (error) {
            throw new Error('Error al eliminar el producto: ' + error.message);
        }
    }    

    generateId(products) {
        const ids = products.map(product => product.id);
        const maxId = Math.max(...ids, 0);
        return maxId + 1;
    }

    async getProductsFromFile() {
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

    async saveProductsToFile(products) {
        return new Promise((resolve, reject) => {
            fs.writeFile(this.path, JSON.stringify(products, null, 2), 'utf8', (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}

module.exports = ProductManager;