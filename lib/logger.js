const winston = require('winston');

// Set up the logger
const logger = winston.createLogger({
  format: winston.format.json(),
  defaultMeta: { service: 'nori' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
      level: 'info'
    }),
  ]
});

module.exports = logger;
