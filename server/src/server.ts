import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import { initializePassport } from "./passport/passportConfig";
import router from "./routes/routes";

dotenv.config();
const app = express();
app.use(express.json());

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));


app.use(
  session({
    secret: "ecommercesecret", // Add through .env file
    resave: false,
    saveUninitialized: false
  })
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use("/", router);

const port = process.env.BACKEND_PORT || 3333;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
