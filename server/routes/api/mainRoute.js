const express = require('express')
const router = express.Router()
const userController = require('../../controllers/main/userController')
const { signupValidationRules, signinValidRules, validate } = require('../../controllers/validator')

// 登入/登出
router.post('/signup', signupValidationRules(), validate, userController.signUp)
router.post('/signin', signinValidRules(), validate, userController.signIn)
router.get('/test', (req, res) => { res.json({ status: 'success', msg: 'successfully connected' }) })

module.exports = router