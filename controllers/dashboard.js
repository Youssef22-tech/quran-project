const Plan = require('../models/plan');
const axios = require('axios');
const { getProgress } = require('../funchelper');
const catchAsync = require('../utils/catchAsync');
const questions = require('../data/questions.json');
const adhkar = require('../data/athkar.json');

module.exports.getDashboard = catchAsync(async (req, res) => {

	const plans = await Plan.find({ user: req.session.user.id });

	const response = await axios.get('https://api.alquran.cloud/v1/surah');
	const surahs = response.data.data;

	const surahMap = {};
	surahs.forEach(s => {
		surahMap[s.number] = { arabic: s.name };
	});

	// Add SurahName for Each one
	const plansWithProgress = plans.map(plan => ({
		...plan.toObject(),
		progress: getProgress(plan),
		surahName: surahMap[plan.surahId]?.arabic || 'غير معروف'
	}));

	// Daily-Question
	const now = new Date();
	const startYear = new Date(now.getFullYear(), 0, 0);
	const dayOfYear = Math.floor((now - startYear) / (1000 * 60 * 60 * 24));
	const todayQ = questions[dayOfYear % questions.length];

	// Athkar-Loop
	const currentHour = now.getHours();
	const todayDhikr = adhkar[currentHour % adhkar.length];

	res.render('dashboard/dashboard', {
		plans: plansWithProgress,
		user: req.session.user,
		todayQuestion: todayQ,
		todayDhikr
	});
});