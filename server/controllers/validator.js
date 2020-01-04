const { body, validationResult } = require('express-validator')
const db = require('../models')
const User = db.User

const signupValidationRules = () => {
  return [
    // account
    body('account')
      .not().isEmpty(),
    // phone must be right rules
    body('phone')
      .not().isEmpty()
      .isLength({ min: 4 }).withMessage('must be at least 4 chars long')
      .custom(value => {
        return User.findUserByPhone(value).then(user => {
          if (user) return Promise.reject('Phone already in use')
        })
      }),

    body('password')
      .not().isEmpty()
      .matches(/\d/).withMessage('must contain a number')
      .isLength({ min: 5 }).withMessage('must be at least 5 chars long'),
    // .custom((value, { req }) => {
    //   if (value != req.body.passwordCheck)
    //     throw new Error('Password confirmation is incorrect')
    // }),

    body('passwordCheck')
      .not().isEmpty()
      .matches(/\d/).withMessage('must contain a number')
      .isLength({ min: 5 }).withMessage('must be at least 5 chars long')
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
  signupValidationRules,
  validate,
}