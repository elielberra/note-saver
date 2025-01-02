import winston from "winston";
import { isProductionEnv } from "../lib/utils";
import { ErrorLogData, LogData, UNSPECIFIED_ERROR } from "../types/types";
import { rabbitMQSender } from "./rabbitmq";

const colorizer = winston.format.colorize();
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: "DD-MM-YY HH:mm:ss.SSS" }),
  winston.format.printf((info) =>
    colorizer.colorize(
      info.level,
      `${info.timestamp} -- ${info.message} ${info.errorDetails ? `\n${info.errorDetails}` : ""}`
    )
  )
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

function getConsoleErrorMessage({ errorName, errorMessage, errorStack }: LogData) {
  if (!errorName && !errorStack) return "";
  if (errorStack) return errorStack;
  if (errorName === UNSPECIFIED_ERROR || !errorMessage) return errorName;
  return `${errorName}: ${errorMessage}`;
}

function addMissingProperties(logData: LogData) {
  return {
    errorStack: null,
    errorMessage: null,
    errorName: null,
    ...logData
  };
}

export function generateLog(logData: LogData) {
  const completeLogData = addMissingProperties(logData);
  rabbitMQSender.sendToQueue(JSON.stringify(completeLogData));
  if (logData.service === "client") return;
  consoleLogger.log(logData.logLevel, logData.logMessage, {
    errorDetails: getConsoleErrorMessage(logData)
  });
}

export function getLogErrorData(error: unknown): ErrorLogData {
  if (error instanceof Error) {
    return {
      errorName: error.name,
      errorMessage: error.message,
      errorStack: error.stack
    };
  }
  return { errorName: UNSPECIFIED_ERROR };
}
