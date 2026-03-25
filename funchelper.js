// Progress-Bar  
module.exports.getProgress = (plan) => {
    const totalAyahs = plan.endAyah - plan.startAyah + 1;
    let progress = (plan.completedAyahs / totalAyahs) * 100;
    if (progress > 100) progress = 100;
    return Math.floor(progress);
}

module.exports.updateStreak = (plan) => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const lastDate = plan.lastCompletedDate
        ? new Date(plan.lastCompletedDate).toDateString()
        : null;

    // تحديث الستريك اذا استمر اكثر من يوم, او اعادته اذا لم يسجل من يومين
    if (lastDate === today) {
    } else if (lastDate === yesterday) {
        plan.streak += 1;
    } else {
        plan.streak = 1;
    }


    if (plan.streak > plan.longestStreak) {
        plan.longestStreak = plan.streak;
    }
    // سجل اخر ميعاد للمراقبة
    plan.lastCompletedDate = new Date();
}

module.exports.checkStreakBroken = (plan) => {
    if (!plan.lastCompletedDate) return false;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const lastDate = new Date(plan.lastCompletedDate).toDateString();
    return lastDate !== today && lastDate !== yesterday;
}