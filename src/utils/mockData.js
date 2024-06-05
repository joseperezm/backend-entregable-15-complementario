const faker = require('faker');

function generateProducts(numProducts = 100, page = 1, limit = 10) {
    const products = [];
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    for (let i = startIndex; i < endIndex && i < numProducts; i++) {
        products.push({
            id: faker.datatype.uuid(),
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            code: faker.datatype.uuid(),
            price: parseFloat(faker.commerce.price()),
            stock: faker.datatype.number({ min: 0, max: 100 }),
            category: faker.commerce.department(),
            thumbnails: "uploads/placeholder.jpg",
            status: faker.datatype.boolean()
        });
    }
    return products;
}

function generateProductsApi(numProducts = 100) {
    const products = [];
    for (let i = 0; i < numProducts; i++) {
        products.push({
            id: faker.datatype.uuid(),
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            code: faker.datatype.uuid(),
            price: parseFloat(faker.commerce.price()),
            stock: faker.datatype.number({ min: 0, max: 100 }),
            category: faker.commerce.department(),
            thumbnails: "uploads/placeholder.jpg",
            status: faker.datatype.boolean()
        });
    }
    return products;
}

module.exports = { generateProducts, generateProductsApi };