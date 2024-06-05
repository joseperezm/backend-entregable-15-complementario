const logger = require("../config/logger");
exports.showError = (req, res) => {
    const message = req.query.message || 'Ocurrió un error inesperado.';
    res.render('error', { message });
    logger.error("Ocurrió un error inesperado.");
};