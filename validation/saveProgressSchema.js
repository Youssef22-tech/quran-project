const Joi = require('joi');

module.exports = Joi.object({
    ayahIndex: Joi.number().integer().min(1).required()
        .messages({
            'number.base': 'Invalid Ayah index',
            'number.min': 'Invalid Ayah index',
            'any.required': 'Ayah index is required'
        })
});
