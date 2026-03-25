const User = require('../models/userSchema');
const bcrypt = require('bcrypt');
const catchAsync = require('../utils/catchAsync');

module.exports.getRegister = (req, res) => {
    res.render('users/register');
};


module.exports.register = catchAsync(async (req, res) => {
    const existing = await User.findOne({
        $or: [{ username: req.body.username }, { email: req.body.email }]
    });

    if (existing) {
        req.flash('error', 'اسم المستخدم او البريد الإلكتروني مستخدم بالفعل');
        return res.redirect('/register');
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
        username: req.body.username.trim(),
        email: req.body.email.trim().toLowerCase(),
        password: hashedPassword
    });

    await newUser.save();
    req.session.user = { id: newUser._id, username: newUser.username }; // Give user session when register

    req.flash('success', `مرحبا ${newUser.username}!تم إنشاء حسابك بنجاح`);
    res.redirect('/dashboard');
});


module.exports.getLogin = (req, res) => {
    res.render('users/login');
};


module.exports.login = catchAsync(async (req, res) => {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
        req.flash('error', 'اسم المستخدم او كلمة المرور غير صحيحة');
        return res.redirect('/login');
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
        req.flash('error', 'اسم المستخدم او كلمة المرور غير صحيحة');
        return res.redirect('/login');
    }

    req.session.regenerate((err) => {
        if (err) {
            req.flash('error', 'حدث خطأ، حاول مرة اخرى');
            return res.redirect('/login');
        }
        req.session.user = { id: user._id, username: user.username };
        req.flash('success', `اهلا بعودتك ${user.username}!`);
        res.redirect('/dashboard');
    });
});


module.exports.logout = (req, res) => {
    req.flash('success', 'Successfuly Logged Out')
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
};