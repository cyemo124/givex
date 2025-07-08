const express = require('express')
const router = express.Router()
const users = require('../controllers/users')
const { storeReturnTo } = require('../middleware')
const passport = require('passport')
const catchAsync = require('../utils/catchAsync')
const User = require('../models/user')
const { isLoggedIn } = require('../middleware')
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })

router.route('/signup')
    .get(users.renderSignup)
    .post(upload.single('profileImage'), catchAsync(users.signup))

router.route('/login')
    .get(users.renderLogin)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

router.get('/check-username', users.checkUsername)

router.get('/profile', isLoggedIn, users.renderProfile)

router.route('/profile/edit')
    .get(isLoggedIn, users.renderProfileEdit)
    .post(isLoggedIn, upload.single('profileImage'), catchAsync(users.ProfileEdit))

router.get('/logout', users.logout);

module.exports = router