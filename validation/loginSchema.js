const Joi = require('joi');

module.exports = Joi.object({
    username: Joi.string().required()
        .messages({
            'any.required': 'Username is required'
        }),

    password: Joi.string().required()
        .messages({ 'any.required': 'Password is required' })
});
