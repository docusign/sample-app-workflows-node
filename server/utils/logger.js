const { createLogger, format, transports } = require('winston');

const createPrefixedLogger = prefix => {
  return createLogger({
    level: 'info',
    format: format.combine(
      format.colorize(),
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      format.printf(info => `${info.timestamp} ${info.level}: ${prefix ? `[${prefix}] ` : ''}${info.message}`)
    ),
    transports: [new transports.Console()],
  });
};

module.exports = createPrefixedLogger;
