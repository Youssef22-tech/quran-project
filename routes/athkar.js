const express = require('express');
const router = express.Router();
const athkar = require('../controllers/athkar');

router.get('/', athkar.renderIndex);

router.get('/sabah', athkar.renderSabah);

router.get('/masaa', athkar.renderMasaa);

module.exports = router;