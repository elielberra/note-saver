import winston from "winston";
import { isProductionEnv } from "../lib/utils";

const myCustomFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'DD-MM-YY HH:mm:ss.SSS' }),
  winston.format.printf(
    (info) =>
      ` ${info.timestamp}--${info.level} : ${info.message}`
  )
);
winston.addColors({
  debug: 'bold cyan',
  info: 'bold blue',
  warn: 'bold yellow',
  error: 'bold red'
});


const logger = winston.createLogger({
  level: isProductionEnv() ? 'info' : 'debug',
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
      format: winston.format.combine(myCustomFormat)
    })
  ]
});

export default logger;
