# NoteSaver Application

## Overview

I developed this application as an exploratory project to experiment with various technology stacks and infrastructure tools. While the user interface is relatively simple, the code adheres to good practices and includes some noteworthy infrastructure features.

This app allows users to write notes. Once the users are logged in, they can create their own notes. They can also archive and tag them.

## Monorepo Structure

This project is organized as a monorepo to streamline development and deployment. It contains:
- **Client**: Frontend application
- **Server**: Backend services
- **Database**: Configuration and setup
- **Infrastructure**: Additional tools like bash scripts, an nginx proxy, Vagrant and more

## Frontend Client

It was developed with React and TypeScript. It is compiled and served through [Webpack](https://webpack.js.org/).

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

## Nginx Proxy

An [Nginx](https://nginx.org/en/) proxy is used to forward requests to the **client** and **server**, ensuring seamless communication between services. Additionally, the proxy is configured with SSL certificates to provide secure connections.

## Git Actions

Git Actions are used for automating various tasks in the repository:

- `Build and Push Docker Images` generates the Docker images for the **client** and **server** on each push to the master branch with a CI/CD pipeline, ensuring smooth integration and deployment processes.
- `Auto Create Pull Request` automatically creates a Pull Request when a new branch is created in the remote repository.


## Pre-Push Hook

A pre-push hook is implemented using [Husky](https://typicode.github.io/husky/) to enforce styling and code quality checks. The hook is configured on the **client**, but since this is a monorepo, it also triggers checks for the **server**. These checks and tests only run when files specific to their respective services are modified.

## Testing

The application includes basic test coverage using [Jest](https://jestjs.io/), primarily as an experiment. While the current coverage is minimal, additional tests may be added in the future to enhance reliability.

## Bash Scripts

The `setupLocalEnvironment.sh` bash script configures the host machine to run this application. It executes three sub-scripts to achieve this:

- The real `.env` file is not uploaded to the repository for security reasons. However, a dummy `.env` file is included, and its passwords can be auto-populated using `insertDummyPasswords.sh`.
- `insertDummyPasswords.sh` generates the Certificate Authority (CA) and the key required for creating SSL certificates. It also configures the CA to be recognized as a valid authority by the operating system. Additionally, this script automatically configures Google Chrome and Mozilla Firefox to trust the CA.
- `configureHostsFile.sh` modifies the hosts file to enable local DNS resolution for the domains `notesaver` and `server.notesaver`.

## How to Run this App

### Locally

The `setupLocalEnvironment` script is designed specifically for Debian/Ubuntu distributions. If you are using Windows, macOS, or another Linux distribution, the script may not work as-is. You can try modifying it to run on your OS.

To ensure the app runs correctly, the environment must be set up using this script. If you don’t have a Debian/Ubuntu machine, you can either manually adapt the script for your system or use the provided `Vagrantfile`. This file sets up an Ubuntu Bionic virtual machine where all dependencies will be installed automatically, including a UI, Docker, Docker Compose, and Google Chrome.

If you already have a Debian/Ubuntu machine, you can skip this and proceed directly to the section [Start the Application](#start-the-application).


#### How to set up the VM

You first need to have [Vagrant](https://developer.hashicorp.com/vagrant/docs/installation) and [VirtualBox](https://www.virtualbox.org/wiki/Downloads) installed. Clone this repository on your host machine. And follow these commands:
```bash
cd <path_to_notesaver_repo>/vagrant
vagrant up
```
The UI of Virtual Box with the VM initializating will appear. Switch back to the terminal on which you run the `vagrant up` command and wait for the message 'The VM was succesfully configured!' to appear (be patient, it may take a while). After that, switch back to Virtual Box's UI and login into the Ubuntu session with these default credentials: user 'vagrant' and password 'vagrant'. When prompted for the setup of the first startup select 'Use default config'". Launch `google-chrome` from a terminal to initialize the browser (it is important that you initialize google-chrome with this command before runing the `setupLocalEnvironment.sh` script). Follow the steps down below.

#### Start the Application

After you have cloned/downloaded this repository perform these commands:

```bash
cd <path_to_notesaver_repo>\note-saver
bash scripts/setupLocalEnvironment.sh
docker compose up
```
Access https://notesaver:8080 on the browser
