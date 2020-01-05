const express = require('express')
const router = express.Router()
const userController = require('../../controllers/admin/userController')
const { signupValidationRules, signinValidRules, validate } = require('../../controllers/validator')

// 登入/登出
router.post('/signup', signupValidationRules(), validate, userController.signUp)
router.post('/signin', signinValidRules(), validate, userController.signIn)

module.exports = router