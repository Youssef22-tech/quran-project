const express = require('express');
const router = express.Router();
const planController = require('../controllers/plans');
const { requireLogin, validate, requireBrowser, preventDoubleSave } = require('../middlware/middleware')
const { planSchema, saveProgressSchema } = require('../validation/index')


router.get('/new', requireLogin, planController.renderNewPlan);

router.post('/',
    requireLogin,
    validate(planSchema),
    planController.createPlan
);

router.get('/:id',
    requireLogin,
    planController.showPlan
);


router.post('/:id/delete',
    requireLogin,
    planController.deletePlan
);

router.post('/:id/save-progress',
    requireLogin,
    requireBrowser,
    preventDoubleSave,
    validate(saveProgressSchema),
    planController.saveProgress
);

router.get('/:id/review', requireLogin, planController.reviewPlan);

module.exports = router;