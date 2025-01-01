import winston from "winston";
import { isProductionEnv } from "../lib/utils";
import { LogData } from "../types/types";

const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: "DD-MM-YY HH:mm:ss.SSS" }),
  winston.format.printf((info) => `${info.timestamp} -- ${info.message}`)
);
winston.addColors({
  debug: "bold cyan",
  info: "bold blue",
  warn: "bold yellow",
  error: "bold red"
});

const consoleLogger = winston.createLogger({
  level: isProductionEnv() ? "info" : "debug",
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
      format: winston.format.combine(consoleFormat)
    })
  ]
});

export function generateLog(logData: LogData) {
  // TODO: Add logic for RabbitMQ
  if (logData.service === "client") return;
  consoleLogger.log(logData.logLevel, logData.logMessage);
  if (logData.error) {
    let message = "";
    if (logData.error instanceof Error) {
      if (logData.error.stack) {
        message = logData.error.stack;
      } else {
        message = `${logData.error.name}: ${logData.error.message}`;
      }
    } else {
      message = logData.error as string;
    }
    consoleLogger.log(
      "error",
      message
    );
  }
}

export default consoleLogger;
