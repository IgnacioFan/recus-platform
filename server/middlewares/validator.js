const { body, validationResult } = require('express-validator')
const db = require('../models')
const User = db.User

const signupValidationRules = () => {
  return [
    body('account')
      .not().isEmpty().withMessage('帳號不可空白!'),

    body('phone')
      .not().isEmpty().withMessage('電話不可空白!')
      .matches(/^09\d{8}$/).withMessage('電話格式錯誤!')
      .custom(value => {
        return User.searchIsPhone(value).then(user => {
          if (user) return Promise.reject('此號碼已有人使用!')
        })
      }),

    body('password')
      .not().isEmpty().withMessage('密碼不可空白!')
      .matches(/^[0-9a-zA-Z]+$/).withMessage('只接受數字和英文字母大小寫!')
      .isLength({ min: 5, max: 10 }).withMessage('密碼最少5位數/最多10位數!'),
    // .custom((value, { req }) => {
    //   if (value != req.body.passwordCheck)
    //     throw new Error('Password confirmation is incorrect')
    // }),

    body('passwordCheck')
      .not().isEmpty().withMessage('密碼檢查不可空白!')
      .matches(/^[0-9a-zA-Z]+$/).withMessage('只接受數字和英文字母大小寫!')
      .isLength({ min: 5, max: 10 }).withMessage('密碼最少5位數/最多10位數!'),

    body('name')
      .not().isEmpty().withMessage('名稱不可空白!'),

    body('email')
      .isEmail().withMessage('信箱格式錯誤!')

  ]
}

const signinValidRules = () => {
  return [
    body('account')
      .not().isEmpty().withMessage('帳號不可空白!'),

    body('password')
      .not().isEmpty().withMessage('密碼不可空白!')
      .isLength({ min: 5, max: 10 }).withMessage('密碼最少5位數/最多10位數!'),
  ]
}

const changePasswordValidRules = () => {
  return [
    body('passwordOld')
      .not().isEmpty().withMessage('舊密碼不可空白!')
      .matches(/^[0-9a-zA-Z]+$/).withMessage('只接受數字和英文字母大小寫!')
      .isLength({ min: 5, max: 10 }).withMessage('舊密碼最少5位數/最多10位數!'),

    body('passwordCheck')
      .not().isEmpty().withMessage('密碼檢查不可空白!')
      .matches(/^[0-9a-zA-Z]+$/).withMessage('只接受數字和英文字母大小寫!')
      .isLength({ min: 5, max: 10 }).withMessage('密碼檢查最少5位數/最多10位數!'),

    body('passwordNew')
      .not().isEmpty().withMessage('新密碼不可空白!')
      .isLength({ min: 5, max: 10 }).withMessage('新密碼最少5位數/最多10位數!')
  ]

}

const profileValidRules = () => {
  return [
    body('account')
      .not().isEmpty().withMessage('帳號不可空白!')
      .custom(value => {
        return User.searchIsAccount(value).then(user => {
          if (user && user.account !== value) return Promise.reject('此帳號已有人使用!')
        })
      }),

    body('phone')
      .not().isEmpty().withMessage('電話不可空白!')
      .matches(/^09\d{8}$/).withMessage('電話格式錯誤!')
      .custom(value => {
        return User.searchIsPhone(value).then(user => {
          if (user && user.phone !== value) return Promise.reject('此號碼已有人使用!')
        })
      }),

    body('name')
      .not().isEmpty().withMessage('名稱不可空白!'),

    body('email')
      .isEmail().withMessage('信箱格式錯誤!')
  ]
}

const nameValidRules = () => {
  return [
    body('name')
      .not().isEmpty().withMessage('名稱不可空白!')
  ]
}

const dishValidRules = () => {
  return [
    body('name')
      .not().isEmpty().withMessage('名稱不可空白!'),

    body('price')
      .not().isEmpty().withMessage('金額不可空白!'),

    body('CategoryId')
      .not().isEmpty().withMessage('請選擇分類!')
  ]
}

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) return next()

  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return res.status(422).json({ errors: extractedErrors })
}

module.exports = {
  nameValidRules,
  dishValidRules,
  profileValidRules,
  signupValidationRules,
  signinValidRules,
  changePasswordValidRules,
  validate,
}