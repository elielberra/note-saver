import amqp from "amqplib";
import { generateLog } from ".";

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
        logMessage: "Server's RabbitMQ connection initialized successfully"
      });
    } catch (error) {
      generateLog({
        logLevel: "error",
        service: "server",
        logMessage: "Failed to initialize Server's RabbitMQ connection"
      });
      throw error;
    }
  }

  async sendToQueue(message: string) {
    await this.connect();
    this.channel!.publish(this.exchange, process.env.RABBITMQ_ROUTING_KEY!, Buffer.from(message), {
      persistent: true
    });
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
        logMessage: "Closed successfully Server's RabbitMQ connection"
      });
    } catch (error) {
      generateLog({
        logLevel: "error",
        service: "server",
        logMessage: "Failed to initialize Server's RabbitMQ connection"
      });
      throw error;
    }
  }
}

export const rabbitMQSender = new RabbitMQSender();
