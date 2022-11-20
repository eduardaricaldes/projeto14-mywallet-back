import express from "express";
import { MongoClient} from "mongodb";
import cors from "cors";
import joi from "joi";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import {v4 as uuidv4} from "uuid";

import { users } from "./controllers/user.controller.js";

//# CONFIG
dotenv.config();
const app = express();
app.use (express.json());
app.use(cors());

export const UserSchema = joi.object({
  name: joi.string().required().min(3).max(100),
  email: joi.string().email().required(),
  password: joi.string().required(),
});

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

app.post("/sign-in", async (req,res)=>{
  const {email, password} = req.body 
  const token = uuidv4()

  try {
    const ExistsUser = await userCollection.findOne({email})
    if(!ExistsUser){
      return res.sendStatus(401)
    }

    const ExistsPassword = bcrypt.compareSync(password, ExistsUser.password);
    if(!ExistsPassword){
       return res.sendStatus(401) 
    }
    await db.collection("sessions").insertOne({
      token,
      usersId: ExistsUser._id,
    })

    
    res.send({token});
  } catch (error) {
    console.log (error)
    res.send(500)
    
  }
})

app.listen(4000, () => console.log("Port 4000"));
