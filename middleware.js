const { userSchema } = require('./schemas.js')
const ExpressError = require('./utils/ExpressError')
const Request = require('./models/request')
const User = require('./models/user')

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        if (req.method === 'GET') {
            req.session.returnTo = req.originalUrl;
        } else {
            req.session.returnTo = req.get('Referrer') || '/campgrounds';
        }
        req.flash('error', 'You must be signed in first');
        return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params
    const request = await Request.findById(id)
    if (!request.author.equals(req.user._id)) {
        req.flash('error', 'You do not have the permission to do that')
        return res.redirect(`/request/${id}`)
    }
    next()
}

function isDonor(req, res, next) {
    if (req.user && req.user.role === 'donor') return next();
    req.flash('error', 'Donors only.');
    return res.redirect('/');
}

function isReceiver(req, res, next) {
    if (req.user && req.user.role === 'receiver') return next();
    req.flash('error', 'Receivers only.');
    return res.redirect('/');
}

module.exports.isAdmin = (req, res, next) => {
  if (!req.isAuthenticated() || req.user.role !== 'admin') {
    req.flash('error', 'Access denied.');
    return res.redirect('/');
  }
  next();
};


