const db = require('../../models')
const User = db.User
const bcrypt = require('bcryptjs')
const Op = require('sequelize').Op
  // JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const userController = {
  getUsers: (req, res) => {
    return User.findAll().then(users => {
      //console.log(users)
      return res.json(users)
    })
  },

  getUser: (req, res) => {
    if (Number(req.params.id) <= 0) {
      return res.json({ status: 'error', msg: 'No such user!' })
    }
    User.findByPk(req.params.id).then(user => {
      if (user == null) {
        return res.res.json({ status: 'error', msg: 'No such user!' })
      }
      console.log('user', user)
      return res.json(user)
    })
  },

  searchUser: (req, res) => {
    if (!req.query.phone) {
      return res.json({ status: 'error', msg: '請輸入電話!' })
    }
    User.findOne({ where: { phone: req.query.phone } }).then(user => {
      if (!user) {
        return res.json({ status: 'error', msg: '找不到會員!' })
      }
      return res.json(user)
    })
  },
  // Signup signin routes
  signUp: (req, res) => {
    if (req.body.passwordCheck !== req.body.password) {
      return res.json({ status: 'error', message: '兩次密碼輸入不同！' })
    } else {
      User.findOne({
        where: {
          [Op.or]: [
            { account: req.body.account },
            { phone: req.body.phone }
          ]
        }
      }).then(user => {
        if (user) {
          return res.json({ status: 'error', message: '信箱重複！' })
        } else {
          User.create({
            account: req.body.account,
            phone: req.body.phone,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            return res.json({ status: 'success', message: '成功註冊帳號！' })
          })
        }
      })
    }
  },

  signIn: (req, res) => {
    // 檢查必要資料
    console.log(req.body)
    console.log(req.body.password)
    if (!req.body.account || !req.body.password) {
      return res.status(401).json({ status: 'error', message: "required fields didn't exist" })
    }
    // 檢查 user 是否存在與密碼是否正確
    let username = req.body.account
    let password = req.body.password

    User.findOne({
      where: {
        [Op.or]: [
          { account: username },
          { phone: username }
        ]
      }
    }).then(user => {
      if (!user) return res.status(401).json({ status: 'error', message: 'no such user found' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: 'passwords did not match' })
      }
      // 簽發 token
      var payload = { id: user.id }
      var token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.json({
        status: 'success',
        message: 'ok',
        token: token,
        user: {
          id: user.id,
          account: user.account,
          phone: user.phone,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin
        }
      })
    })
  }
}

module.exports = userController