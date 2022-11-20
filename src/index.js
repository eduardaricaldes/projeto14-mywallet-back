import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./database/db.js";

import userRouter from './routes/user.route.js'
import walletRouter from './routes/wallet.route.js'

//# CONFIG
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
connectDB();


app.use(userRouter);
app.use(walletRouter);

app.listen(4000, () => console.log("Port 4000"));
