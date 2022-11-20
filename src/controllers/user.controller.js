 import bcrypt from "bcrypt";
 import {userCollection, UserSchema} from"../index.js"
 
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