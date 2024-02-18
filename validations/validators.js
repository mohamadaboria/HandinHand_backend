const Joi = require("joi");

// general validator function that validate any schema
const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });

// register info validate
const registerSchema = Joi.object({
  mobile: Joi.string()
    .pattern(/^[0-9]+$/)
    .min(9)
    .required(),
  email: Joi.string().required(),
  name: Joi.string().required(),
  type: Joi.string().valid("student", "researcher", "professor").required(),
  gender: Joi.string().required().valid("male", "female"),
  password: Joi.string().required(),
  birthDate: Joi.date(),
  hand: Joi.string().valid("left", "right"),
  language: Joi.string().valid("arabic", "english", "hebrew"),
  version: Joi.string().valid("normal", "notNormal"),
  hearingNormal: Joi.string().valid("yes", "no"),
  origin: Joi.string().valid("israel", "usa"),
  ADHD: Joi.string().valid("yes", "no"),
  musicalBackground: Joi.string().valid("yes", "no"),
});

//create new research
const research = Joi.object({
  researher: Joi.string().required(),
  researchQuestion: Joi.string().required(),
  hand: Joi.array().valid("left", "right"),
  language: Joi.array().valid("arabic", "english", "hebrew"),
  vision: Joi.array().valid("normal", "notNormal"),
  hearingNormal: Joi.array().valid("yes", "no"),
  origin: Joi.array().valid("israel", "usa"),
  ADHD: Joi.array().valid("yes", "no"),
  musicalBackground: Joi.array().valid("yes", "no"),
  Credits: Joi.number().required(),
  approvment: Joi.string(),
});

exports.userRegister = validator(registerSchema);
