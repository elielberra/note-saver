package main

import (
	"log"

	"github.com/rabbitmq/amqp091-go"
)

func main() {
	messages, err := connectAndConsumeRabbit()
	if err != nil {
		log.Fatalf("%v", err)
	}

	for msg := range messages {
		go func(msg amqp091.Delivery) {
			sendToElastic(msg)
		}(msg)
	}
	log.Println("The RabbitMQ channel has been closed")
}
