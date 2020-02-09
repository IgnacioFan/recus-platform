const express = require('express')
const router = express.Router()
const userController = require('../../controllers/main/userController')
const { signupValidationRules, signinValidRules, changePasswordValidRules, validate } = require('../../middlewares/validator')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
// 登入/登出
router.post('/signup', signupValidationRules(), validate, upload.single('avatar'), userController.signUp)
router.post('/signin', signinValidRules(), validate, userController.signIn)
router.get('/test', (req, res) => { res.json({ status: 'success', msg: 'successfully connected' }) })
// 當前使用者與更改密碼(需要登入)
router.get('/user', userController.getCurrentUser)
router.post('/password/change', changePasswordValidRules(), validate, userController.changePassword)

module.exports = router