const Joi = require('joi')

module.exports = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required()
        .messages({
            'string.alphanum': 'Username must contain only letters and numbers',
            'string.min': 'Username must be at least 3 characters',
            'string.max': 'Username cannot exceed 30 characters',
            'any.required': 'Username is required'
        }),
    email: Joi.string().email({ tlds: { allow: false } }).required()
        .messages({
            'string.email': 'Invalid email address',
            'any.required': 'Email is required'
        }),
    password: Joi.string().min(6).max(72).required()
        .messages({
            'string.min': 'Password must be at least 6 characters',
            'string.max': 'Password cannot exceed 72 characters',
            'any.required': 'Password is required'
        })
})