const express = require("express");
const router = express.Router();
const logger = require("../config/logger");

router.get('/', (req, res) => {
    logger.debug("Mensaje de nivel debug (solo development)");
    logger.http("Mensaje de nivel http (solo development)");
    logger.info("Mensaje de nivel info");
    logger.warn("Mensaje de nivel warning");
    logger.error("Mensaje de nivel error");
    logger.fatal("Mensaje de nivel fatal");

    res.send("Logs de prueba generados, revisa el sistema de logging.");
});

module.exports = router;