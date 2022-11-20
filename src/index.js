import express from "express";
import { MongoClient} from "mongodb";
import cors from "cors";
import dotenv from "dotenv";

import { users, signIn } from "./controllers/user.controller.js";

//# CONFIG
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const mongoClient = new MongoClient(process.env.MONGO_URI);

try {
  await mongoClient.connect()
} catch (error) {
  console.log (error)
}

const db = mongoClient.db("dbDuda");
export const userCollection = db.collection("users")

// #ROTA

app.post("/sign-up",users);

app.post("/sign-in",signIn)

app.listen(4000, () => console.log("Port 4000"));
