package main

import (
	"bytes"
	"fmt"
	"log"
	"os"

	"github.com/elastic/go-elasticsearch/v8"
	"github.com/joho/godotenv"
	"github.com/rabbitmq/amqp091-go"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}
	messages, err := connectAndConsumeRabbit()
	if err != nil {
		log.Fatalf("%v", err)
	}

	for msg := range messages {
		go func(msg amqp091.Delivery) {
			cfg := elasticsearch.Config{
				Addresses: []string{
					fmt.Sprintf("http://%s:9200", os.Getenv("ELASTIC_DOMAIN")),
				},
				Username: os.Getenv("ELASTIC_USER"),
				Password: os.Getenv("ELASTIC_PASSWORD"),
			}
			es, err := elasticsearch.NewClient(cfg)
			if err != nil {
				log.Printf("Error creating the Elasticsearch client: %s", err)
				return
			}

			res, err := es.Index(
				os.Getenv("ELASTIC_INDEX"),
				bytes.NewReader(msg.Body),
			)
			defer res.Body.Close()
			if err != nil {
				log.Printf("Error while trying to index a log: %s", err)
				return
			}
			if res.IsError() {
				log.Printf("Error on the Response to Elasticsearch - Status code: %s", res.Status())
				return
			}
			fmt.Println("Log successfully sent to Elasticsearch") // TODO: Delete me
		}(msg)
	}
	log.Println("The RabbitMQ channel has been closed")
}
