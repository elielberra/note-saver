package main

import (
	"log"
	"os"

	"github.com/rabbitmq/amqp091-go"
)

func connectAndConsumeRabbit() (<-chan amqp091.Delivery, error) {
	amqpURL := "amqp://" + os.Getenv("RABBITMQ_USER") + ":" + os.Getenv("RABBITMQ_PASSWORD") + "@" + os.Getenv("RABBITMQ_SERVICENAME") + ":5672/" + os.Getenv("RABBITMQ_VHOST")

	conn, err := amqp091.Dial(amqpURL)
	if err != nil {
		log.Println("Failed to connect to RabbitMQ")
		return nil, err
	}

	ch, err := conn.Channel()
	if err != nil {
		conn.Close()
		log.Println("Failed to open a channel")
		return nil, err
	}

	queueName := os.Getenv("RABBITMQ_QUEUE")
	q, err := ch.QueueDeclare(
		queueName,
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		conn.Close()
		ch.Close()
		log.Println("Failed to declare a queue")
		return nil, err
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
		conn.Close()
		ch.Close()
		log.Println("Failed to register a consumer")
		return nil, err
	}
	log.Println("The consumer service is ready to retrieve messages from the queue")
	return messages, nil
}
