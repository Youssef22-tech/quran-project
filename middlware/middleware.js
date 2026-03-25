const mongoose = require('mongoose')

module.exports.requireLogin = (req, res, next) => {
    if (!req.session.user) return res.redirect('/login');
    next()
}

module.exports.redirectIfLoggedIn = (req, res, next) => {
    if (req.session.user) return res.redirect('/dashboard');
    next();
}

module.exports.isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
}

// Joi validate
module.exports.validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const messages = error.details.map(d => d.message).join(' | ');
            if (req.headers['content-type']?.includes('application/json')) {
                return res.status(400).json({ success: false, error: messages });
            }
            req.flash('error', error.details[0].message);
            return res.redirect('/plan/new');
        }
        next();
    };
}

module.exports.requireBrowser = (req, res, next) => {
    const isAjax = req.headers['x-requested-with'] === 'XMLHttpRequest';
    const isFetch = req.headers['sec-fetch-mode'] === 'cors' ||
        req.headers['sec-fetch-mode'] === 'same-origin';
    const hasOrigin = !!req.headers['origin'];

    if (!isAjax && !isFetch && !hasOrigin) {
        return res.status(403).json({ success: false, error: 'غير مسموح' });
    }
    next();
}

// (Rate-Limiting)
const progressLocks = new Map();
module.exports.preventDoubleSave = (req, res, next) => {
    const key = `${req.session.user.id}-${req.params.id}`;
    if (progressLocks.has(key)) { //
        return res.status(429).json({ success: false, error: 'Please wait' });
    }
    progressLocks.set(key, true);
    res.on('finish', () => progressLocks.delete(key));
    next();
}