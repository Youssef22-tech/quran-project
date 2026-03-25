const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
    surahId: { type: Number, required: true }, // 1 - 114
    startAyah: { type: Number, required: true },
    endAyah: { type: Number, required: true },
    dailyCount: { type: Number, required: true }, // الايات اليومية

    currentDay: { type: Number, default: 1 },
    completedAyahs: { type: Number, default: 0 },
    lastCompletedAyah: { type: Number, default: 0 },
    // Streak System
    streak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastCompletedDate: { type: Date, default: null },
    nextAvailableAt: { type: Date, default: null },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Link userId on it
});

module.exports = mongoose.model('Plan', planSchema);