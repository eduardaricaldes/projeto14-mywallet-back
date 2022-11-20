import joi from "joi";

export const WalletSchema = joi.object({
  description: joi.string().min(3).required(),
  value: joi.number().required(),
  type: joi.string().valid('wallet-in','wallet-out').required(),
})