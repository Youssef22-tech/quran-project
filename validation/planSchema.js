const Joi = require('joi');

module.exports = Joi.object({
    surahId: Joi.number().integer().min(1).max(114).required()
        .messages({
            'number.min': 'Invalid Surah number',
            'number.max': 'Invalid Surah number',
            'any.required': 'Surah is required'
        }),

    startAyah: Joi.number().integer().min(1).required()
        .messages({
            'any.required': 'Start Ayah is required',
            'number.min': 'Start Ayah must be at least 1'
        }),

    endAyah: Joi.number().integer()
        .min(Joi.ref('startAyah'))
        .required()
        .messages({
            'number.min': 'End Ayah must be greater than or equal to Start Ayah',
            'any.required': 'Required!'
        }),

    dailyCount: Joi.number().integer().min(1).max(50).required()
        .messages({
            'number.min': 'Daily goal must be at least 1 Ayah',
            'number.max': 'Daily goal cannot exceed 50 Ayahs',
            'any.required': 'Daily goal is required'
        })
});




// }).custom((val, helpers) => {
//     if (val.startAyah > val.endAyah) {
//         return helpers.error('any.invalid');
//     }
//     return val;
// }).messages({
//     'any.invalid': 'Start Ayah must be less than or equal to End Ayah'