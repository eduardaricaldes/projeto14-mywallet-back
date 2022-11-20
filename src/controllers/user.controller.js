import bcrypt from "bcrypt";
import {v4 as uuidv4} from "uuid";
import { userCollection, sessionsCollection } from "../database/collections.js"
import { UserSchema } from "../schema/user.shema.js";
import { AuthSchema } from '../schema/auth.schema.js';

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

    const userAlreadyLogged = await sessionsCollection.findOne({
      usersId: ExistsUser._id
    })

    if(userAlreadyLogged) {
      return res
        .status(401)
        .send({ message: "Você já está logado, sai para logar novamente" });
    }


    await sessionsCollection.insertOne({
      token,
      usersId: ExistsUser._id,
    })

    res.send({
      token,
      name: ExistsUser.name,
      email: ExistsUser.email,
    });
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}

export async function logout(req, res) {
  const token = req.get('Authorization');

  const { error } = AuthSchema.validate({
    token,
  })

  if(error) {
    const erros = error.details.map((details) => details.message)
    return res.status(401).send(erros)
  }

  try {
    const session = await sessionsCollection.findOne({
      token,
    })

    if(session !== null) {
      const user = await userCollection.findOne({ 
        _id: session.usersId 
      });
      if (!user) {
        return res.status(400).send();
      }

      await sessionsCollection.deleteOne({
        _id: session._id,
        usersId: session.usersId,
      })
      res.send();
    }else {
      res.status(400).send();
    }
  } catch (error) {
    res.status(500).send(error)
  }
}