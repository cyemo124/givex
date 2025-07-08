const User = require('../models/user')
const Request = require('../models/request')
const { userSchema } = require('../schemas');
const { cloudinary, storage } = require('../cloudinary')

module.exports.renderSignup = (req, res) => {
    res.render('givex/signup')
}

module.exports.checkUsername = async (req, res) => {
    const { username } = req.query;
    if (!username) return res.json({ available: false });
    const user = await User.findOne({ username: new RegExp('^' + username + '$', 'i') });
    res.json({ available: !user });
};

module.exports.signup = async (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        req.flash('error', msg);
        return res.redirect('/signup');
    }

    try {
        const { username, password, firstName, lastName, email, role } = req.body;
        const user = new User({ username, firstName, lastName, email, role });
        if (req.file) {
            user.profileImage = {
                url: req.file.path,
                filename: req.file.filename
            };
        }
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Givex!!!!');
            res.redirect('/givex');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('givex/login')
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!')
    const redirectUrl = res.locals.returnTo || '/givex'
    delete req.session.returnTo
    res.redirect(redirectUrl)
}

module.exports.renderProfile = async (req, res) => {
    const user = await User.findById(req.user._id);
    const requests = await Request.find({});
    if (user.role === 'donor') {
        return res.render('givex/profile/donor', { user });
    } else if (user.role === 'receiver') {
        const requests = await Request.find({ author: user._id });
        res.render('givex/profile/receiver', { user, requests });
    } else {
        req.flash('error', 'Invalid user role');
        return res.redirect('/');
    }
}

module.exports.renderProfileEdit = (req, res) => {
    res.render('givex/editProfile', { user: req.user });
}

module.exports.ProfileEdit = async (req, res, next) => {
    const user = await User.findById(req.user._id);
    const { username, firstName, lastName, email, deleteImage } = req.body;

    // Update fields
    user.username = username;
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;

    // Handle image delete
    if (deleteImage && user.profileImage?.filename) {
        await cloudinary.uploader.destroy(user.profileImage.filename);
        user.profileImage = undefined;
    }

    // Handle new image upload
    if (req.file) {
        user.profileImage = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await user.save();

    // ✅ Refresh session
    req.login(user, err => {
        if (err) return next(err);
        req.flash('success', 'Profile updated successfully!');
        res.redirect('/profile');
    });
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/givex');
    });
}