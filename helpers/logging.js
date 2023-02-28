const winston = require('winston');
require('express-async-errors');
let configuration = require('../config/config')



module.exports = function () {


  winston.exceptions.handle(
    new winston.transports.Console({ colorize: true, prettyPrint: true, }),
    new winston.transports.File({ filename: './logs/uncaughtExceptions.log' })
  );

  process.on('unhandledRejection', (ex) => {
    throw ex;
  });

  if (configuration.logs.file === 'y' || true) {
    winston.add(
      new winston.transports.File({
        level: configuration.logs.file_level,
        filename: configuration.logs.file_path,
        format: winston.format.combine(winston.format.json(), winston.format.timestamp()),
      })
    );
  }

  if (configuration.logs.console === "y" || true) {
    winston.add(
      new winston.transports.Console({
        level: configuration.logs.console_level,
        colorize: true,
        prettyPrint: true,
      })
    )
  }

}