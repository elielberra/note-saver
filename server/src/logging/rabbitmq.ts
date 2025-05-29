import amqp from "amqplib";
import { consoleLogger, generateLog, getConsoleErrorMessage } from ".";
import { ErrorLogData, UNSPECIFIED_ERROR } from "../types/types";

class RabbitMQSender {
  private channel: amqp.Channel | null = null;
  private isChannelOpened: boolean = false;
  private exchange = process.env.RABBITMQ_EXCHANGE!;

  async connectWithRabbit() {
    if (this.isChannelOpened) {
      return;
    }
    try {
      const connection = await amqp.connect({
        protocol: "amqp",
        hostname: process.env.RABBITMQ_SERVICENAME,
        username: process.env.RABBITMQ_USER,
        password: process.env.RABBITMQ_PASSWORD,
        vhost: process.env.RABBITMQ_VHOST,
        frameMax: 8192
      });
      this.channel = await connection.createChannel();
      this.isChannelOpened = true;
      this.channel.on("close", () => {
        this.isChannelOpened = false;
        consoleLogger.error("The RabbitMQ channel has been closed");
      });
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
    await this.connectWithRabbit();
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
        (errorLogData.errorName = error.name),
          (errorLogData.errorMessage = error.message),
          (errorLogData.errorStack = error.stack);
      } else {
        errorLogData.errorName = UNSPECIFIED_ERROR;
      }
      consoleLogger.error(`Error while trying to send to RabbitMQ the log:\n${message}`, {
        errorDetails: getConsoleErrorMessage(errorLogData)
      });
    }
  }
}

export const rabbitMQSender = new RabbitMQSender();
