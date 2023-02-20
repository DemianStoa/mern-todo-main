const express = require('express')
const router = express.Router()
const loginLimiter = require('../middleware/loginLimiter')
const auth = require('../controllers/auth')

router.route('/login')
    .post(loginLimiter, auth.login)

router.route('/register')
    .post(auth.register)

router.route('/refresh')
    .get(auth.refresh)

router.route('/logout')
    .post(auth.logout)

module.exports = router