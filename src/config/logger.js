const winston = require('winston');
const path = require('path');
const program = require('../utils/commander');

const mode = program.opts().mode;

const logLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'red',
        warn: 'yellow',
        info: 'green',
        http: 'magenta',
        debug: 'white'
    }
};

const logger = winston.createLogger({
    levels: logLevels.levels,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(info => `${info.timestamp} - ${info.level}: ${info.message}`)
    )
});

if (mode === 'production') {
    logger.add(new winston.transports.Console({
        level: 'info',
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }));
    logger.add(new winston.transports.File({
        filename: path.join(__dirname, '..', 'logs', 'errors.log'),
        level: 'error'
    }));
} else {
    logger.add(new winston.transports.Console({
        level: 'debug',
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }));
}

winston.addColors(logLevels.colors);

module.exports = logger;
