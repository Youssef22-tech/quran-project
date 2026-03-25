const express = require('express')
const router = express.Router()
const { requireLogin, redirectIfLoggedIn, validate } = require('../middlware/middleware')
const { registerSchema, loginSchema } = require('../validation/index')
const userControllers = require('../controllers/users')

router.route('/register')
    .all(redirectIfLoggedIn)
    .get(userControllers.getRegister)
    .post(validate(registerSchema), userControllers.register);

router.route('/login')
    .all(redirectIfLoggedIn)
    .get(userControllers.getLogin)
    .post(validate(loginSchema), userControllers.login);

router.get('/logout', requireLogin, userControllers.logout);

module.exports = router;