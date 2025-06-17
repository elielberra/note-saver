package main

import (
	"bytes"
	"fmt"
	"log"
	"os"

	"github.com/elastic/go-elasticsearch/v8"
	"github.com/rabbitmq/amqp091-go"
)

var esClient *elasticsearch.Client

func init() {
	cfg := elasticsearch.Config{
		Addresses: []string{
			fmt.Sprintf("%s://%s:%s", os.Getenv("ELASTIC_PROTOCOL"), os.Getenv("ELASTIC_DOMAIN"), os.Getenv("ELASTIC_PORT")),
		},
		Username: os.Getenv("ELASTIC_USER"),
		Password: os.Getenv("ELASTIC_PASSWORD"),
	}
	es, err := elasticsearch.NewClient(cfg)
	if err != nil {
		log.Fatalf("Error creating the Elasticsearch client: %s", err)
	}
	esClient = es
}

func sendToElastic(msg amqp091.Delivery) {
	res, err := esClient.Index(
		os.Getenv("ELASTIC_INDEX"),
		bytes.NewReader(msg.Body),
	)
	if err != nil {
		log.Printf("Error while trying to index a log: %s", err)
		return
	}
	if res != nil {
		defer res.Body.Close()
	}
	if res.IsError() {
		log.Printf("Error on the Response to Elasticsearch - Status code: %s", res.Status())
		return
	}
}
