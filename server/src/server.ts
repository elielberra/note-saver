import dotenv from "dotenv";
import express from "express";
import router from "./routes/routes"

dotenv.config();
const app = express();
app.use(express.json());
app.use("/", router)

const port = process.env.BACKEND_PORT || 3333;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
