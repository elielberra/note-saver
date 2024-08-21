import dotenv from "dotenv";
import express from "express";
import cors, { CorsOptions } from "cors";
import passport from "passport";
import session from "express-session";
import { initializePassport } from "./passport/passportConfig";
import router from "./routes/routes";

dotenv.config();
const app = express();
app.use(express.json());

const corsOptions: CorsOptions = {
  origin: ["http://127.0.0.0:3000", "http://127.0.0.1:3000"],
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));

const cookie_min_ttl = 10;
app.use(
  session({
    secret: process.env.SESSION_SECRET || "session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: cookie_min_ttl * 60 * 1000
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());
initializePassport();

app.use("/", router);

const port = process.env.BACKEND_PORT || 3333;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
