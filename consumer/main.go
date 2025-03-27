package main

import (
	"fmt"
	"log"
	"os"
	"bytes"
	"github.com/elastic/go-elasticsearch/v8"
	"github.com/joho/godotenv"
	"github.com/rabbitmq/amqp091-go"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}
	amqpURL := "amqp://" + os.Getenv("RABBITMQ_USER") + ":" + os.Getenv("RABBITMQ_PASSWORD") + "@" + os.Getenv("RABBITMQ_SERVICENAME") + ":5672/" + os.Getenv("RABBITMQ_VHOST")

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

	log.Println("The consumer service is ready to retrieve messages from the queue")

	forever := make(chan bool)

	go func() {
		for msg := range messages {
			log.Printf("Received a message: %s", msg.Body)

			cfg := elasticsearch.Config{
				Addresses: []string{
					fmt.Sprintf("http://%s:9200", os.Getenv("ELASTIC_DOMAIN")),
				},
				Username: os.Getenv("ELASTIC_USER"),
				Password: os.Getenv("ELASTIC_PASSWORD"),
			}

			es, err := elasticsearch.NewClient(cfg)
			if err != nil {
				log.Fatalf("Error creating the Elasticsearch client: %s", err)
			}

			res, err := es.Index(
				os.Getenv("ELASTIC_INDEX"),
				bytes.NewReader(msg.Body),
			)
			if err != nil {
				log.Fatalf("Error indexing log: %s", err)
			}
			defer res.Body.Close()

			if res.IsError() {
				log.Fatalf("Error indexing document. Reponse satuts code: %s", res.Status())
			}

			fmt.Println("Log successfully sent to Elasticsearch")
		}
		log.Println("RabbitMQ channel has been closed. Once the rabbitmq service is up, restart this consumer")
	}()

	<-forever
}
