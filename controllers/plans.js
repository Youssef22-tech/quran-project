const { isValidObjectId } = require('../middlware/middleware');
const axios = require('axios');
const Plan = require('../models/plan');
const catchAsync = require('../utils/catchAsync');

const DAY_IN_MS = 24 * 60 * 60 * 1000;

module.exports.renderNewPlan = catchAsync(async (req, res) => {
    const response = await axios.get('https://api.alquran.cloud/v1/surah');
    res.render('plans/newPlan', { surahs: response.data.data });
});

module.exports.createPlan = catchAsync(async (req, res) => {
    const { surahId, startAyah, endAyah, dailyCount } = req.body;
    const response = await axios.get(`https://api.alquran.cloud/v1/surah/${parseInt(surahId)}`);
    const surah = response.data.data;
    const totalAyahs = surah.numberOfAyahs;
    if (parseInt(endAyah) > totalAyahs) {
        req.flash('error', `اية النهاية اكبر من عدد ايات السورة (${totalAyahs} اية)`);
        return res.redirect('/plan/new');
    }
    const plan = new Plan({
        surahId: parseInt(surahId),
        startAyah: parseInt(startAyah),
        endAyah: parseInt(endAyah),
        dailyCount: parseInt(dailyCount),
        user: req.session.user.id
    });
    await plan.save();
    req.flash('success', `Created Successfully!`);
    res.redirect(`/plan/${plan._id}`);
});

module.exports.showPlan = catchAsync(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
        req.flash('error', 'Plan not Found');
        return res.redirect('/dashboard');
    }
    const plan = await Plan.findOne({
        _id: req.params.id,
        user: req.session.user.id
    });
    if (!plan) {
        req.flash('error', 'Forbidden, You have no access');
        return res.redirect('/dashboard');
    }
    const response = await axios.get(
        `https://api.alquran.cloud/v1/surah/${plan.surahId}`
    );
    const surah = response.data.data;
    const startToday = plan.startAyah + (plan.currentDay - 1) * plan.dailyCount;
    const endToday = Math.min(startToday + plan.dailyCount - 1, plan.endAyah);
    if (startToday > plan.endAyah) {
        return res.render('plans/finished', { surah, plan });
    }
    const todayAyahs = surah.ayahs.slice(startToday - 1, endToday);
    const resumeFrom = plan.lastCompletedAyah || 0;
    const now = new Date();
    const isLocked = !!(plan.nextAvailableAt && plan.nextAvailableAt > now);
    const nextAvailableAt = plan.nextAvailableAt
        ? plan.nextAvailableAt.toISOString()
        : null;
    res.render('plans/plan', {
        surah,
        todayAyahs,
        plan,
        resumeFrom,
        isLocked,
        nextAvailableAt,
        startToday
    });
});

module.exports.saveProgress = catchAsync(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
        return res.status(400).json({ success: false, error: 'Invalid ID' });
    }
    const plan = await Plan.findOne({
        _id: req.params.id,
        user: req.session.user.id
    });
    if (!plan) {
        return res.status(403).json({ success: false, error: 'Unallowed, You have no access' });
    }
    const now = new Date();
    if (plan.nextAvailableAt && plan.nextAvailableAt > now) {
        return res.status(403).json({ success: false, error: 'Come Tomorrow!' });
    }
    const { ayahIndex } = req.body;
    if (ayahIndex > plan.dailyCount) {
        return res.status(400).json({
            success: false,
            error: 'لا يستطيع الوصول الي ايات اليوم الثاني في اليوم الاول'
        });
    }
    // Correct Arrangement تأكيد الترتيب الصحيح للمستخدم
    if (ayahIndex !== plan.lastCompletedAyah + 1) {
        return res.status(400).json({
            success: false,
            error: 'Unarranged'
        });
    }
    // Save Progress حفظ التقدم لأكمال اليوم الاخر بالورد اليوم الثاني
    plan.lastCompletedAyah = ayahIndex;
    plan.completedAyahs += 1;
    if (ayahIndex === plan.dailyCount) {
        plan.currentDay += 1;
        plan.lastCompletedAyah = 0;
        plan.lastCompletedDate = now;
        plan.nextAvailableAt = new Date(now.getTime() + DAY_IN_MS);
    }
    await plan.save();
    return res.json({
        success: true,
        nextAvailableAt: plan.nextAvailableAt
    });
});

module.exports.deletePlan = catchAsync(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
        req.flash('error', 'Invalid ID');
        return res.redirect('/dashboard');
    }
    await Plan.findOneAndDelete({
        _id: req.params.id,
        user: req.session.user.id
    });
    req.flash('success', 'Deleted Successfully!');
    res.redirect('/dashboard');
});

module.exports.reviewPlan = catchAsync(async (req, res) => {
    const plan = await Plan.findOne({
        _id: req.params.id,
        user: req.session.user.id
    });
    if (!plan) {
        return res.redirect('/dashboard');
    }
    const response = await axios.get(
        `https://api.alquran.cloud/v1/surah/${plan.surahId}`
    );
    const surah = response.data.data;
    const completedAyahs = surah.ayahs.slice(
        plan.startAyah - 1,
        plan.startAyah - 1 + plan.completedAyahs
    );
    res.render('plans/reviews', { surah, plan, completedAyahs });
});