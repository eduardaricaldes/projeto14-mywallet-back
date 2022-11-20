import { WalletSchema } from "./../schema/wallet.schema.js"
import { walletCollection } from "../database/collections.js"

export async function wallet(req, res) {
  const {
    description,
    value,
    type
  } = req.body;

  const { error } = WalletSchema.validate({
    description,
    value,
    type
  }, { abortEarly: false })

  if(error) {
    const erros = error.details.map((details) => details.message);
    return res.status(400).send(erros)
  }

  try {
    await walletCollection.insertOne({
      description,
      value,
      type,
      createdAt: Date.now(),
    })
    res.send()
  } catch (error) {
    res.status(500).send(error)
  }
};

export async function getWallet(req, res) {
  try {
    const response = await walletCollection.find().toArray()
    res.send(response);
  } catch (error) {
    res.status(500).send(error)
  }
};