# NoteSaver Application

## Overview

### Basic Functionalities

This app allows users to write notes. Once the users are logged in, they can create their own notes. They can also archive and tag them.

### Objective

I developed this application as an exploratory project to experiment with various technology stacks and infrastructure tools. While the user interface is relatively simple, the code adheres to good practices and includes several noteworthy infrastructure features.

## Monorepo Structure

This project is organized as a monorepo to streamline development and deployment. It contains:
- **Client**: Frontend application  
- **Server**: Backend services  
- **Database**: Configuration and setup
- **RabbitMQ Server**: Message broker for async communication  
- **Consumer**: Processes messages from RabbitMQ  
- **Elasticsearch**: Search and analytics engine  
- **Kibana**: Visualization tool for Elasticsearch  
- **Nginx**: An Nginx server proxy
- **SSL**: Automatic SSL certificates setup during Development
- **Docker**: All the services are containerized
- **Kubernetes**: Deploy using Kubernetes infrastructure  
- **Bash scripts**: Automation and utility scripts 
- **Git Actions**: CI/CD workflows for automation  
- **Git Hooks**: Run tests and linters before commits  
- **Vagrant**: Virtual Debian distribution environment setup  

## Frontend Client

It was developed with React and TypeScript. It is compiled and served through [Webpack](https://webpack.js.org/).

#### Configuration File (`config.json`)

This application uses a `config.json` file to define environment-specific settings. The file must include the `SERVER_URL`, which specifies the base URL of the backend server that the client will send API requests to. This value will vary depending on the environment (e.g., development, staging, production). The `config.json` file should be mounted or placed in the application's `public/` folder so that it is accessible at runtime from the root path (`/config.json`).

#### Generate React Icon

The icons were downloaded from the web (the licenses are found in the SVG files). These icons were transformed into React components using the `svgr` library. The config file `.svgrc.js` uses a template to format them and manipulate some of their properties. To generate a React icon component from an SVG, store the SVG in `client/src/assets` and run the command `npm run icons:create`.

## Backend Server

It was developed with Node and TypeScript. It contains the API for performing basic operations with the notes and manages user sessions.

#### Database Seed

If you want to populate the database with some dummy data, you can execute the command: `npm run seed` (note that it will first **DESTROY** your previous database).

## Common Config Files for Frontend and Backend

- The Prettier file `.prettierrc` enforces consistent code style. Run `npm run prettier:fix` on the client and server apps to apply that styling to the code.
- The `jest.config.js` file is used to configure Jest, the testing framework. To run the tests, use the command `npm run test`.
- The `eslint.config.mjs` file configures the ESLint syntax checks. Use the command `npm run lint` to view the warnings and errors in the repository.
- The `tsconfig.json` file is used to configure TypeScript. It defines the TypeScript compiler options and helps enforce consistent TypeScript settings across the project.
- The `babel.config.js` file is used to configure Babel, a JavaScript compiler. It is used to ensure compatibility between Jest and Typescript.

## Database

[PostgreSQL](https://www.postgresql.org/) is the engine of the app. Its data model is composed of tables containing user data, notes, their corresponding tags, and session information. The file `init.sql` will set up this data model.

#### How to Connect to the Database

After starting the app with docker compose run:
```bash
docker exec -it db bash
psql -U postgres
\c note_saver
\dt # List tables
```

## Logging

On the server side, the application uses the **Winston** library for logging, with colorized logs in the console for improved readability. On the client side, **Loglevel** is used for logging, and it only logs to the browser console in non-production environments. In production, logging is minimized to reduce unnecessary performance overhead and to avoid exposing the error stack and potentially sensitive code to the user for security reasons.

## RabbitMQ

This project uses [RabbitMQ](https://www.rabbitmq.com/documentation.html) to manage message queues. Logs from both the client and server are sent to RabbitMQ for centralized processing. Server logs are sent directly to the queue, while client logs are sent to the server via HTTP and then forwarded to the queue. A consumer retrieves the logs from the queue and forwards them to Elasticsearch.

You might be wondering why the app doesn’t harvest logs through Filebeat and send them to Elasticsearch, as that is the usual flow. However, as I mentioned earlier, this project aims to explore different technologies and architectural approaches.  

The user, queue, virtual host, and other configurations are declared in a `definitions.json` file, which is loaded by `rabbitmq.conf` during startup.

The password set on the `password_hash` key of the definitions file, can be created with the command `docker run --rm rabbitmq:3-management rabbitmqctl hash_password '<PASSWORD>'`. The value that is set on the `rabbitmq/definitions.json` and `k8s/rabbitmq/files/load_definition.json` was created with the value "password", so that it is consistent with the `insertDummyPasswords.sh` script.

The server can be configured to avoid sending logs to the RabbitMQ service using the `RABBITMQ_ENABLED` environment variable. Sometimes it's easier to disable it—especially when you want to quickly test something in development mode, or if you simply want to run the client, server, and database without the additional overhead of RabbitMQ, the consumer, Elasticsearch, and Kibana.

## Consumer

The Consumer service is written in Go and is responsible for retrieving messages from a RabbitMQ service. Once the messages are received, it sends the data to an Elasticsearch service for log storage and indexing.

Note that the Consumer will actually consume the messages from the queue. Therefore, if this service is running, you will not find any messages queued in the RabbitMQ management console.

## Elasticsearch  

[Elasticsearch](https://www.elastic.co/docs) is a search and analytics engine. In this project, logs from the consumer are sent directly to Elasticsearch and indexed in the `note-saver` index.  

## Kibana  

[Kibana](https://www.elastic.co/guide/en/kibana/8.7/index.html) is a visualization tool for exploring and analyzing data in Elasticsearch. Create a data view (the version 8 equivalent of an index pattern) with the `note-saver` index pattern to view the logs.

When running Kibana with `docker-compose` the credentials are configured on a set up container since they can't be set up on a config file on the new version of Elasticsearch.

## Nginx Proxy

When running the App with `docker-compose`, an [Nginx](https://nginx.org/en/) proxy is used to forward requests to the **client**, **server**, **RabbitMQ Magement UI** and **Kibana** ensuring seamless communication between services. Additionally, the proxy is configured with SSL certificates to provide secure connections. On `Kubernetes`, an [Nginx Ingress Controller](https://docs.nginx.com/nginx-ingress-controller/) will be in charge of routing the requests to each correspondent service.

## Git Actions

Git Actions are used for automating various tasks in the repository:

- `Build and Push Docker Images` generates the Docker images for the **client**, the **server**, and the **consumer** on each push to the `master` branch using a CI/CD pipeline. This process ensures that the latest code changes are automatically built, tested, and pushed to Docker Hub. It also builds images for multiple platforms (`amd64` and `arm64`) in parallel using matrix builds, allowing for broader compatibility and faster deployments across different environments.
- `Auto Create Pull Request` automatically creates a Pull Request when a new branch is created in the remote repository.

## Pre-Push Hook

A pre-push hook is implemented using [Husky](https://typicode.github.io/husky/) to enforce styling and code quality checks. The hook is configured on the **client**, but since this is a monorepo, it also triggers checks for the **server**. These checks and tests only run when files specific to their respective services are modified.

## Testing

The application includes basic test coverage using [Jest](https://jestjs.io/), primarily as an experiment. While the current coverage is minimal, additional tests may be added in the future to enhance reliability.

## Bash Scripts  

The `setupDockerComposeEnvironment.sh` script configures the host machine to run this application by setting up environment variables, generating SSL certificates, ensuring local DNS resolution, configuring executable permissions, and adjusting the virtual memory settings of the OS. It automates tasks like inserting dummy passwords, creating and trusting a Certificate Authority (CA), and modifying the hosts file for local development.

The `setupMinikubeEnvironment.sh` script sets up a local Kubernetes environment using Minikube by verifying dependencies, installing Flux for GitOps-based deployments, and enabling essential addons like Ingress and Metrics Server. It configures the development environment by creating the necessary namespace, inserting dummy passwords, generating and trusting SSL certificates, updating the local hosts file for DNS resolution. Finally, it applies Kubernetes manifests and Helm repository configurations to deploy the application into the cluster.

Some scripts in the `k8s/scripts` folder call shared base scripts from the `scripts` folder using the `--environment minikube` flag. This approach avoids code duplication and enables environment-specific configuration, allowing the same base scripts to be reused for both Docker Compose and Minikube setups by simply changing the environment parameter.

## Vagrant

Using a VM ensures the app runs consistently across different operating systems (like Windows or macOS), since the setup scripts are tailored for Ubuntu-based environments.

The `provision.sh` script configures an Ubuntu-based virtual machine by installing a graphical user interface (GUI), Docker, Docker Compose, and Google Chrome. It also sets up system permissions, initializes a file for SSL certificate generation, and provides instructions to the user for starting the Note Saver application with Docker Compose.

The `Vagrantfile` defines a virtual machine using the `ubuntu/bionic64` base image  and provisions the VM using the `provision.sh` script to automatically set up the development environment.

## How to Run this App

### Locally

You can run this app locally using either `docker-compose` or `minikube`.

#### Docker Compose

This is the simplest and most straightforward way to deploy this app. You only need to have [Docker](https://docs.docker.com/engine/install/) and [Docker Compose](https://docs.docker.com/compose/install/) installed.

##### Environment Setup

The `setupDockerComposeEnvironment.sh` script is designed specifically for Debian/Ubuntu distributions. If you are using Windows, macOS, or another Linux distribution, the script may not work as-is. You can try modifying it to run on your OS.

To ensure the app runs correctly, the environment must be set up using this script. If you don’t have a Debian/Ubuntu machine, you can either manually adapt the script for your system or use the provided `Vagrantfile`. This file sets up an Ubuntu Bionic virtual machine where all dependencies will be installed automatically, including a UI, Docker, Docker Compose, and Google Chrome.

If you already have a Debian/Ubuntu machine, you can skip this and proceed directly to the section [Start the Application](#start-the-application).

##### How to set up the VM

You first need to have [Vagrant](https://developer.hashicorp.com/vagrant/docs/installation) and [VirtualBox](https://www.virtualbox.org/wiki/Downloads) installed. Clone this repository on your host machine. And follow these commands:

```bash
cd <path_to_notesaver_repo>/vagrant
vagrant up
```

The UI of Virtual Box with the VM initializating will appear. Switch back to the terminal on which you run the `vagrant up` command and wait for the message 'The VM was succesfully configured!' to appear (be patient, it may take a while). After that, switch back to Virtual Box's UI and login into the Ubuntu session with these default credentials: user 'vagrant' and password 'vagrant'. When prompted for the setup of the first startup select 'Use default config'". Launch `google-chrome` from a terminal to initialize the browser (it is important that you initialize google-chrome with this command before runing the `setupDockerComposeEnvironment.sh` script). Follow the steps down below.

##### Start the Application

After you have cloned/downloaded this repository perform these commands:

```bash
cd <path_to_notesaver_repo>\note-saver
bash scripts/setupDockerComposeEnvironment.sh
docker compose up
```

Access https://docker-compose.notesaver:8080 on the browser

#### Minikube

You can deploy this app locally on a Kubernetes cluster using [Minikube](https://minikube.sigs.k8s.io/docs/). You can also use `k3d` or any other similar tool, but the script `setupDockerComposeEnvironment.sh` will automatically configure your machine for seamless deployment.  
To do so, run the following commands:

```bash
cd <path_to_notesaver_repo>\note-saver
bash scripts/setupDockerComposeEnvironment.sh
```

Wait a couple of minutes for all services to be ready. You can use [k9s](https://k9scli.io/topics/install/) to interact with your local cluster.

#### Credentials During Development

During development, the script `insertDummyPasswords.sh` automatically sets the super secure value `password` as a placeholder for all environment variables containing `PASSWORD`, `SECRET`, or `PASSPHRASE`. Therefore, that will be the default value for each service, and the usernames are specified in the `.env` file.

### URLs for each service with its Credentials

| Service   | Environment    | URL                                               | User   | Password |
|-----------|----------------|---------------------------------------------------|--------|----------|
| Client    | Docker Compose | https://docker-compose.notesaver:8080            | N/A    | N/A      |
| Client    | Minikube       | https://minikube.notesaver                       | N/A    | N/A      |
| Server    | Docker Compose | https://docker-compose.server.notesaver:8080     | N/A    | N/A      |
| Server    | Minikube       | https://minikube.server.notesaver                | N/A    | N/A      |
| Kibana    | Docker Compose | https://docker-compose.kibana.notesaver:8080     | elastic| password |
| Kibana    | Minikube       | https://minikube.kibana.notesaver                | elastic| password |
| RabbitMQ  | Docker Compose | https://docker-compose.rabbitmq.notesaver:8080   | admin  | password |
| RabbitMQ  | Minikube       | https://minikube.rabbitmq.notesaver              | admin  | password |

