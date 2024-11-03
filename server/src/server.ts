import dotenv from "dotenv";
import express from "express";
import cors, { CorsOptions } from "cors";
import passport from "passport";
import https from "https";
import fs from "fs";
import path from "path";
import { initializePassport } from "./passport/passportConfig";
import router from "./routes/routes";

dotenv.config();
const app = express();
app.use(express.json());

const corsOptions: CorsOptions = {
  origin: [
    "https://127.0.0.1:3000",
    "https://notesaver:3000"
  ],
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));

app.use(passport.initialize());
initializePassport();

app.use("/", router);

const port = process.env.BACKEND_PORT!;

const privateKey = fs.readFileSync(path.join(__dirname, "..", "ssl-certs", "cert-key.pem"), "utf8");
const certificate = fs.readFileSync(path.join(__dirname, "..", "ssl-certs", "cert.pem"), "utf8");
const httpsServer = https.createServer(
  { key: privateKey, cert: certificate },
  app
);
httpsServer.listen(port, () => {
  console.log(`HTTPS server listening on port ${port}`);
});
