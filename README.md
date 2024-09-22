# NoteSaver Application

This is the repository for an app that allows users to write notes. Once the users are logged in, they can create their own notes. They can also archive and tag them.

## Frontend Client
It was developed with React and TypeScript. It is compiled and served through Webpack.

#### Generate React Icon
The icons were downloaded from the web (the licenses are found in the SVG files). These icons were transformed into React components using the `svgr` library. The config file `.svgrc.js` uses a template to format them and manipulate some of their properties. To generate a React icon component from an SVG, store the SVG in `client/src/assets` and run the command `npm run icons:create`.

## Backend Server
It was developed with Node and TypeScript. It contains the API for performing basic operations with the notes and manages user sessions.

#### Database Seed
If you want to populate the database with some dummy data, you can execute the command: `npm run seed` (note that it will first **DESTROY** your previous database).

## Common Config Files for Frontend and Backend
- The ESLint file `eslint.config.mjs` performs syntax checks. To validate that the code follows the established guidelines, run `npm run lint`.
- The Prettier file `.prettierrc` enforces consistent code style. To format the code according to these standards, run `npm run prettify`.

## Database
PostgreSQL is the engine of the app. Its data model is composed of tables containing user data, notes, their corresponding tags, and session information. The file `init.sql` will set up this data model.

#### How to Connect to the Database
After starting the app with docker compose run:
```
docker exec -it db bash
psql -U postgres
\c note_saver
\dt # List tables
```

## Run this App Locally

### Initial considerations
The real .env file is not upploaded to the repository for security reasons. However, a dummy .env file is, and its passwords can be autopopulated through a bash script. In order to store the session cookies, the site needs to handle traffic through https. Through another script, the SSL certificates and keys will be created and the generated CA is listed as a valid Authority. This will be done automatically for Google Chrome and Mozilla Firefox so that you don't have to manually add configure it. The hosts file is also modified so that DNS resolution can work properly.

### Debian environment
The script that sets up the environment works only for Debian/Ubuntu distributions. If you have Windows, Mac or any other distro it won't work. You can try to adjust the script to run on your OS, or if not, to make things easier, I have prepared a `Vagrantfile` so that you can execute it on an Ubuntu Bionic Virtual Machine. The provisioning script will install all the required dependencies: a UI for the OS, docker, docker compose and Google Chrome.

#### How to set up the VM
You first need to have [Vagrant](https://developer.hashicorp.com/vagrant/docs/installation) and [VirtualBox](https://www.virtualbox.org/wiki/Downloads) installed. Clone this repository on your host machine. And follow these commands:
```
cd <path_to_notesaver_repo>/vagrant
vagrant up
```
The UI of Virtual Box with the VM initializating will appear. Switch back to the terminal on which you run the `vagrant up` and wait for the message "The VM was succesfully configured!" to appear (be patient, it may take a while). After that, switch back to Virtual Box's UI and login into the Ubuntu session with these default credentials: user 'vagrant' and password 'vagrant'. When prompted for the setup of the first startup select 'Use default config'". Launch `google-chrome` from a terminal to initialize the browser (it is important that you initialize google-chrome with this command before runing the `setupLocalEnvironment.sh` script). Follow the steps down below.

### How to run this app
After you have cloned/downloaded this repository perform these commands:
```
cd <path_to_notesaver_repo>\note-saver
bash scripts/setupLocalEnvironment.sh
docker compose up
```
Access https://notesaver:3000 on the browser
