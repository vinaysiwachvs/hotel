const winston = require("winston");
const { combine, timestamp, printf, align } = winston.format;

const { dirname } = require("path");
const appDir = dirname(require.main.filename);

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "debug",
    format: combine(
        timestamp({
            format: "YYYY-MM-DD hh:mm:ss.SSS A",
        }),
        align(),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`),
    ),
    transports: [
        new winston.transports.File({
            filename: `${appDir}/logs/combined.log`,
        }),
        new winston.transports.File({
            filename: `${appDir}/logs/info.log`,
            level: "info",
        }),
        new winston.transports.File({
            filename: `${appDir}/logs/error.log`,
            level: "error",
        }),
        new winston.transports.Console(),
    ],
    exceptionHandlers: [
        new winston.transports.File({
            filename: `${appDir}/logs/exception.log`,
        }),
    ],
    rejectionHandlers: [
        new winston.transports.File({
            filename: `${appDir}/logs/rejection.log`,
        }),
    ],
});

logger.exitOnError = false;

module.exports = logger;
