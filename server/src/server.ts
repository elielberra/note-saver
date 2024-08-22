import dotenv from "dotenv";
import express from "express";
import cors, { CorsOptions } from "cors";
import passport from "passport";
import session from "express-session";
import pgSession from "connect-pg-simple";
import { initializePassport } from "./passport/passportConfig";
import router from "./routes/routes";
import { getDBPool } from "./db/utils";

dotenv.config();
const app = express();
app.use(express.json());

const corsOptions: CorsOptions = {
  origin: ["http://127.0.0.0:3000", "http://127.0.0.1:3000"],
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));

const PgSession = pgSession(session);
const sessionStore = new PgSession({
  pool: getDBPool(),
  tableName: process.env.DB_SESSIONS_TABLE
});
app.use(
  session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: parseInt(process.env.COOKIE_MIN_TTL!) * 60 * 1000,
      httpOnly: true
    }
  })
);
app.use(passport.initialize());
app.use(passport.session());
initializePassport();

app.use("/", router);

const port = process.env.BACKEND_PORT!;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
