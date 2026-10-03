// CONCEPT: JOI SCHEMAS - ek jagah define karo "valid data kaisa dikhta hai",
// fir baar baar if(!field) likhne ki zaroorat nahi.

const Joi = require('joi');

const signupSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email',
    'any.required': 'email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'password must be at least 6 characters',
    'any.required': 'password is required',
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const noteSchema = Joi.object({
  text: Joi.string().min(1).max(500).required().messages({
    'string.max': 'text cannot exceed 500 characters',
    'any.required': 'text field is required',
  }),
});

module.exports = { signupSchema, loginSchema, noteSchema };
