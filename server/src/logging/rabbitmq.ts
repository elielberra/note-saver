import amqp from "amqplib";
import { consoleLogger, generateLog, getConsoleErrorMessage } from ".";
import { ErrorLogData, UNSPECIFIED_ERROR } from "../types/types";

class RabbitMQSender {
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;
  private exchange = process.env.RABBITMQ_EXCHANGE!;

  async connect() {
    if (this.connection && this.channel) {
      return;
    }
    try {
      this.connection = await amqp.connect(
        `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_SERVICENAME}/${process.env.RABBITMQ_VHOST}`
      );
      this.channel = await this.connection.createChannel();
      await this.channel.assertExchange(this.exchange, "direct", { durable: true });
      generateLog({
        logLevel: "info",
        service: "server",
        logMessage: "RabbitMQ connection initialized successfully"
      });
    } catch (error) {
      consoleLogger.error("Error while trying to connect with RabbitMQ");
      throw error;
    }
  }

  async sendToQueue(message: string) {
    await this.connect();
    try {
      this.channel!.publish(
        this.exchange,
        process.env.RABBITMQ_ROUTING_KEY!,
        Buffer.from(message),
        {
          persistent: true
        }
      );
    } catch (error) {
      const errorLogData: ErrorLogData = {};
      if (error instanceof Error) {
          errorLogData.errorName = error.name,
          errorLogData.errorMessage = error.message,
          errorLogData.errorStack = error.stack
      } else {
        errorLogData.errorName = UNSPECIFIED_ERROR
        };
      consoleLogger.error(`Error while trying to send to RabbitMQ the log:\n${message}`, {
        errorDetails: getConsoleErrorMessage(errorLogData)
      });
    }
  }

  async closeConnection() {
    try {
      if (this.channel) {
        await this.channel.close();
        this.channel = null;
      }
      if (this.connection) {
        await this.connection.close();
        this.connection = null;
      }
      generateLog({
        logLevel: "info",
        service: "server",
        logMessage: "Closed successfully RabbitMQ connection"
      });
    } catch (error) {
      consoleLogger.error("Error while trying to close the connection with RabbitMQ");
      throw error;
    }
  }
}

export const rabbitMQSender = new RabbitMQSender();
