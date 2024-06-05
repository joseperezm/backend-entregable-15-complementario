const mongoose = require("mongoose");
const configObject = require("./config/config.js");
const {MONGODB_URI} = configObject;
const logger = require("./config/logger.js");

class DataBase {
    static #instancia; 

    constructor(){
        mongoose.connect(MONGODB_URI).catch(error => {
            logger.error("Error al conectar con Atlas: " + error.message);
            throw error;
        });
    }

    static getInstancia() {
        if(this.#instancia) {
            logger.debug("Conexión previa");
            return this.#instancia;
        }

        this.#instancia = new DataBase();
        logger.debug("Conexión exitosa a Atlas.com");
        return this.#instancia;
    }
}

module.exports = DataBase.getInstancia();