const express = require('express')
const router = express.Router()
const { requireLogin } = require('../middlware/middleware')
const dashboardController = require('../controllers/dashboard')

router.route('/dashboard')
    .all(requireLogin)
    .get(dashboardController.getDashboard);

module.exports = router;