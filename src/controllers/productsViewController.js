const productService = require('../services/productService');
const { generateProducts } = require('../utils/mockData');
const logger = require("../config/logger");

exports.index = async (req, res) => {
    try {
        const limit = req.query.limit === undefined ? 10 : parseInt(req.query.limit, 10);
        const page = parseInt(req.query.page) || 1;
        const sort = req.query.sort || '';
        const query = req.query.query || '';
        
        const options = { limit, page, sort, query };
        const result = await productService.getProducts(options);
        const productosObj = result.products.map(producto => producto.toObject ? producto.toObject() : producto);
        
        const messages = req.flash();
        
        const hasPrevPage = page > 1;
        const hasNextPage = page < result.totalPages;
        const prevPage = hasPrevPage ? page - 1 : null;
        const nextPage = hasNextPage ? page + 1 : null;
        
        const pages = Array.from({ length: result.totalPages }, (_, i) => ({
            number: i + 1,
            isCurrent: (i + 1) === page
        }));

        res.render("products", {
            messages, 
            productos: productosObj,
            options,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            pages,
            sort
        });
    } catch (error) {
        logger.error("Error al obtener productos", error);
        next({ code: 'INTERNAL_SERVER_ERROR', original: error });
    }
};

exports.showMockProducts = (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const numProducts = 100

    const products = generateProducts(numProducts, page, limit);

    const totalPages = Math.ceil(numProducts / limit);
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;
    const prevPage = hasPrevPage ? page - 1 : null;
    const nextPage = hasNextPage ? page + 1 : null;

    const pages = Array.from({ length: totalPages }, (_, i) => ({
        number: i + 1,
        isCurrent: (i + 1) === page
    }));

    res.render("mockProducts", {
        products,
        page,
        totalPages,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
        pages
    });
};
