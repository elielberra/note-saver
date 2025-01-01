import consoleLogger from ".";
import { LogData } from "../types/types";

export function generateLog(logData: LogData) {
  // TODO: Add logic for RabbitMQ
  if (logData.service === "client") return;
  consoleLogger.log(logData.logLevel, logData.logMessage);
  if (logData.error) {
    consoleLogger.log(
      "error",
      logData.error instanceof Error ? logData.error.stack : logData.error
    );
  }
}
