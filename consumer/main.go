package main

import (
	"github.com/joho/godotenv"
	"github.com/rabbitmq/amqp091-go"
	"log"
	"os"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}
	amqpURL := "amqp://" + os.Getenv("RABBITMQ_USER") + ":" + os.Getenv("RABBITMQ_PASSWORD") + "@" + os.Getenv("RABBITMQ_SERVICENAME") + ":5672/" + os.Getenv("RABBITMQ_VHOST")
	queueName := os.Getenv("RABBITMQ_QUEUE")

	conn, err := amqp091.Dial(amqpURL)
	if err != nil {
		log.Fatalf("Failed to connect to RabbitMQ: %v", err)
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		log.Fatalf("Failed to open a channel: %v", err)
	}
	defer ch.Close()

	q, err := ch.QueueDeclare(
		queueName,
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		log.Fatalf("Failed to declare a queue: %v", err)
	}

	messages, err := ch.Consume(
		q.Name,
		"",
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		log.Fatalf("Failed to register a consumer: %v", err)
	}

	log.Printf("The consumer service is ready to retrieve messages from the queue")

	forever := make(chan bool)

	go func() {
		for msg := range messages {
			// TODO: Add logic for sending logs to Elasticsearch
			log.Printf("Received a message: %s", msg.Body)
		}
		log.Println("RabbitMQ channel has been closed. Once the rabbitmq service is up, restart this consumer")
	}()

	<-forever
}
