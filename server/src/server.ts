import dotenv from "dotenv";
import express from "express";
import cors, { CorsOptions } from "cors";
import passport from "passport";
import http from "http";
import { initializePassport } from "./passport/passportConfig";
import router from "./routes/routes";
import { generateLog } from "./logging";

dotenv.config();
const app = express();
app.use(express.json());

const corsOptions: CorsOptions = {
  origin: ["https://notesaver:8080"],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(passport.initialize());
initializePassport();

app.use("/", router);

const port = process.env.BACKEND_PORT!;
const httpServer = http.createServer(app);
httpServer.listen(port, () => {
  generateLog({
    logLevel: "info",
    service: "server",
    logMessage: `HTTP server listening on port ${port}`
  });
});
