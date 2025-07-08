if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const Request = require('./models/request')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')

const mongoSanitize = require('express-mongo-sanitize')

const MongoStore = require('connect-mongo');

const dbUrl = (process.env.DB_URL) || 'mongodb://localhost:27017/givex'

mongoose.connect(dbUrl)

const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("Database connected")
})

const app = express()

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize({
    replaceWith: '_'
}))


const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});

store.on('error', function (e) {
    console.log('SESSION STORE ERROR', e)
})

const sessionCongif = {
    store,
    secret: 'thisshouldbeabettersecret!',
    resave: 'false',
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionCongif))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    // console.log(req.session)
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})


const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/users')
const requestRoutes = require('./routes/requests')

app.use(adminRoutes);
app.use('/', userRoutes)
app.use('/', requestRoutes)

app.get('/', async (req, res) => {
    const requests = await Request.find({}).limit(10).sort({ _id: -1 });
    res.render('givex/index', { requests });
});

app.get('/givex', async (req, res) => {
    const requests = await Request.find({}).limit(10).sort({ _id: -1 });
    res.render('givex/index', { requests });
});

app.use((err, req, res, next) => {
    const statusCode = err.status || 500;
    if (process.env.NODE_ENV === 'production') {
        return res.status(statusCode).render('error', { err: {} });
    } else {
        return res.status(statusCode).render('error', { err });
    }
});


const http = require('http');

const server = http.createServer(app);

server.keepAliveTimeout = 120000; // 120 seconds
server.headersTimeout = 120000;

server.listen(3000, () => {
    console.log(`Server running on port ${3000}`);
});
