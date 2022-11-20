import bcrypt from "bcrypt";
import {v4 as uuidv4} from "uuid";
import { userCollection, sessionsCollection } from "../database/collections.js"
import { UserSchema } from "../schema/user.shema.js";

export async function users (req, res){
  const user = req.body
  const {error} = UserSchema.validate(user, {abortEarly:false})

  if(error){
    const erros = error.details.map((details) => details.message)
    return res.status(400).send(erros)
  }

  const cryptPassword = bcrypt.hashSync(user.password, 12)
  
  try {
    const alreadyExistUser = await userCollection.findOne({email:user.email})
    if(alreadyExistUser){
      return res.sendStatus(409)
    }
    await userCollection.insertOne({...user,password:cryptPassword})
    res.sendStatus(201)

  } catch (error) {
    console.log (error)
    res.sendStatus(500)
  }
  res.send()
};

export async function signIn(req, res) {
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
    sessionsCollection.insertOne({
      token,
      usersId: ExistsUser._id,
    })

    res.send({token});
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}