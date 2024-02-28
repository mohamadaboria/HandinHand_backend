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
  email: Joi.string().email().required(),
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
const createResearchSchema = Joi.object({
  researher: Joi.string(),
  description: Joi.string(),
  researchQuestion: Joi.string().required(),
  hand: Joi.array().items("left", "right").required().min(1),
  language: Joi.array().items("arabic", "english", "hebrew").required().min(1),
  vision: Joi.array().items("normal", "notNormal").required().min(1),
  hearingNormal: Joi.array().items("yes", "no").required().min(1),
  origin: Joi.array().items("israel", "usa").required().min(1),
  ADHD: Joi.array().items("yes", "no").required().min(1),
  musicalBackground: Joi.array().items("yes", "no").required().min(1),
  Credits: Joi.number().required(),
  approvment: Joi.string(),
});

exports.userRegister = validator(registerSchema);
exports.validateCreateResearch = validator(createResearchSchema);
