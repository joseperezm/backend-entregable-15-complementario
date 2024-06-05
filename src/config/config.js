const dotenv = require("dotenv");
const program = require("../utils/commander.js");

const {mode} = program.opts(); 

dotenv.config({
    path: mode === "production" ? "./.env.production": "./.env.development"
});

const configObject = {
    SESSION_SECRET: process.env.SESSION_SECRET,
    MONGODB_URI: process.env.MONGODB_URI,
    APP_PORT: process.env.APP_PORT,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    TEST_USER_EMAIL: process.env.TEST_USER_EMAIL,
    TEST_USER_PASSWORD: process.env.TEST_USER_PASSWORD
}

module.exports = configObject;