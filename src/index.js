import express from "express";
import { MongoClient} from "mongodb";
import cors from "cors";
import dotenv from "dotenv";

import userRouter from './routes/user.route.js'
import walletRouter from './routes/wallet.route.js'

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

const db = mongoClient.db(process.env.DATABASE_NAME);
export const userCollection = db.collection("users")
export const walletCollection = db.collection("wallet")
export const sessionsCollection = db.collection("sessions")
// #ROTA

app.use(userRouter);
app.use(walletRouter);

app.listen(4000, () => console.log("Port 4000"));
