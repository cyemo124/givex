const express = require('express')
const router = express.Router()
const requests = require('../controllers/requests')
const { storeReturnTo } = require('../middleware')
const passport = require('passport')
const catchAsync = require('../utils/catchAsync')
const Request = require('../models/request')
const { isLoggedIn } = require('../middleware')
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })

router.get('/request', requests.renderRequests)

router.get('/request/:id', requests.showRequest)

router.route('/new')
    .get(isLoggedIn, requests.renderNewRequestForm)
    .post(isLoggedIn, upload.array('image'), requests.newRequest)

router.get('/donate/:id', isLoggedIn, requests.renderDonateForm)

module.exports = router