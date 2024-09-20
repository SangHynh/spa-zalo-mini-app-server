const { createLogger, format, transports } = require("winston");

const customFormat = format.printf(({ timestamp, level, message }) => {
    return `${level}: ${timestamp}: ${message}`;
});

module.exports = createLogger({
    format: format.combine(
        format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
        format.align(),
        format.colorize(),
        customFormat
    ),
    transports: [
        new transports.File({ filename: 'logs/logs.log' }),
        new transports.Console()
    ],
});
