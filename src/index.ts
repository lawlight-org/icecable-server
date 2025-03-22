import dotenv from "dotenv";
dotenv.config();
import { Express } from "express";
import auth from "./routes/auth";

console.clear();
const app: Express = require("express")();
const port: number = Number(process.env.APP_PORT) || 1337;

app.use("/auth", auth);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
