import joi from "joi";

export const AuthSchema = joi.object({
  token: joi.string().required()
});