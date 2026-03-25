const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Required!'],
        unique: true,
        trim: true,
        minlength: [3, 'الاسم يجب ان يكون 3 احرف علي الاقل']
    },
    email: {
        type: String,
        required: [true, 'Required!'],
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter valid Email address']
    },
    password: {
        type: String,
        required: [true, 'Required!'],
        minlength: [6, 'كلمة المرور تحتوي علي 6 احرف علي الاقل']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
