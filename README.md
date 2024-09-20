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
```
docker exec -it db bash
psql -U postgres
\c note_saver
\dt # List tables
```

## How to Run this App Locally
You must first the script `scripts/setupLocalEnvironment.sh` so that the SSL certificates are created and the CA is automatically configured on your browser (chrome and mozilla) as a trusted source. This script will also configure proper DNS resolution on the hosts file.
Run `docker-compose up` and enter the URL `https://notesaver:3000`