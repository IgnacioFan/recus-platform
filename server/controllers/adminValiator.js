const { body, validationResult } = require('express-validator')
const db = require('../models')


const nameValidRules = () => {
  return [
    body('name')
      .not().isEmpty().withMessage('請輸入名稱!')
  ]
}

const dishValidRules = () => {
  return [
    body('name')
      .not().isEmpty().withMessage('請輸入名稱!'),

    body('price')
      .not().isEmpty().withMessage('請輸入金額!')
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
  validate,
}