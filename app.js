require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const userRoutes = require('./routes/users')
const planRoutes = require('./routes/plans')
const dashboardRoutes = require('./routes/dashboard')
const athkarRoutes = require('./routes/athkar')
const flash = require('connect-flash')

mongoose.connect(process.env.MONGO_URI);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error'));
db.once('open', () => console.log('DB Connected!'));
// console.log(process.env.MONGO_URI);



app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
}));
app.use(flash()) // Must be after sessionConfig
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', userRoutes)
app.use('/plan', planRoutes)
app.use('/', dashboardRoutes)
app.use('/athkar', athkarRoutes)


app.use((req, res) => {
    res.status(404).send('Error 404, Page not Found');
});


app.listen(PORT, () => console.log(`Connected on Port ${PORT}!`));