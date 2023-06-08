const winston = require("winston");

const logger = winston.createLogger(
  {
    level: "info",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(log => `[${log.level}] [${log.timestamp}] ${log.message} ${log.stack}`),
    ),
    transports: [
      new winston.transports.File({ filename: "error.log", level: "error" }),
      new winston.transports.File({ filename: "app.log" }),
    ],}
);

module.exports = logger;