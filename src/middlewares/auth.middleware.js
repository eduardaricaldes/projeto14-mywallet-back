import { AuthSchema } from '../schema/auth.schema.js';
import { sessionsCollection } from "../database/collections.js"

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
    const response = await sessionsCollection.findOne({
      token,
    })
    if(response !== null) {
      next();
    }else {
      res.status(401).send('Unauthorized');
    }
  } catch (error) {
    res.status(500).send(error)
  }
}