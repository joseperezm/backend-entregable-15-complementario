const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUiExpress = require('swagger-ui-express');

const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentación de la API de Ecommerce",
            description: "API para la gestión de productos y carritos en el sistema de ecommerce"
        }
    },
    apis: ["./src/docs/**/*.yaml"]
};

const specs = swaggerJsdoc(swaggerOptions);

module.exports = { swaggerUiExpress, specs };
