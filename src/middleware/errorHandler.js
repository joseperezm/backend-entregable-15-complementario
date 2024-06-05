const errorCodes = require('../utils/errorCodes');
const logger = require('../config/logger');

function errorHandler(err, req, res, next) {
    const error = errorCodes[err.code] || errorCodes.INTERNAL_SERVER_ERROR;

    logger.error(`${err.code} - ${error.message}`, { message: err.message, stack: err.stack });

    res.status(error.statusCode).json({ message: error.message });
}

module.exports = errorHandler;