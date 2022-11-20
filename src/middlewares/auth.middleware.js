import { AuthSchema } from '../schema/auth.schema.js';
import { sessionsCollection, userCollection } from "../database/collections.js"

export async function auth(req, res, next) {
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
        return res.status(401).send('Unauthorized');
      }

      delete user.password;
      req.user = user;
      next();
    }else {
      res.status(401).send('Unauthorized');
    }
  } catch (error) {
    res.status(500).send(error)
  }
}