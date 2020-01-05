const bcrypt = require('bcryptjs')
const db = require('../../models')
const User = db.User
const Order = db.Order
const Op = require('sequelize').Op

// Json Web Token
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
// 
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const userController = {

  // getCurrentUser
  getCurrentUser: (req, res) => {

    let TokenArray = req.headers.authorization.split(" ");
    let authorization = TokenArray[1]

    jwt.verify(authorization, process.env.JWT_SECRET, (err, authorizedData) => {

      User.findOne({
        where: {
          id: authorizedData.id
        }
      }).then(user => {
        return res.json({
          id: user.id,
          account: user.account,
          phone: user.phone,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin
        })
      })
    })
  },

  // 登入
  signIn: (req, res) => {

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
      if (!user) return res.status(401).json({ status: 'error', msg: '該使用者不存在' })
      if (!bcrypt.compareSync(password, user.password)) {
        // status 401 no permission
        return res.status(401).json({ status: 'error', msg: '密碼不合' })
      }
      // sign a token to accessible user
      var payload = { id: user.id }
      var token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.json({
        status: 'success',
        msg: 'ok',
        token: token,
        user: {
          id: user.id,
          account: user.account,
          phone: user.phone,
          role: user.role
        }
      })
    })
  },

  signUp: (req, res) => {
    if (req.body.passwordCheck !== req.body.password) {
      return res.json({ status: 'error', msg: '兩次密碼輸入不同！' })
    } else {
      User.create({
        account: req.body.account,
        phone: req.body.phone,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
      }).then(user => {
        return res.json({ status: 'success', msg: 'successfully signned up a new account' })
      })
    }
  },

  // getUser: (req, res) => {
  //   if (Number(req.params.id) <= 0) {
  //     return res.json({ status: 'error', msg: 'user id is undefined' })
  //   }
  //   // 取出單一會員，且排除管理者
  //   User.scope('excludedAdmin').findByPk(req.params.id).then(user => {
  //     if (user == null) {
  //       return res.json({ status: 'error', msg: 'no such user!' })
  //     }
  //     //console.log('user', user)
  //     return res.json({ user: user })
  //   })
  // },

  // getUsersPag: (req, res) => {
  //   const pageLimit = 14
  //   let offset = 0
  //   if (req.query.page) {
  //     offset = (req.query.page - 1) * pageLimit
  //   }
  //   User.findAndCountAll({ include: Order, offset: offset, limit: pageLimit }).then(user => {
  //     const page = Number(req.query.page) || 1
  //     const totalPage = Math.ceil(user.count / pageLimit)
  //     const data = user.rows
  //     return res.json({
  //       users: data,
  //       currentPage: page,
  //       totalPage: totalPage
  //     })
  //   })
  // },

  // deleteUser: (req, res) => {
  //   return User.findByPk(req.params.id)
  //     .then((user) => {
  //       user.destroy()
  //         .then((user) => {
  //           return res.json({ status: 'success', msg: 'The user has been deleted.' })
  //         })
  //     })
  // },

  // toggleAdmin: (req, res) => {
  //   return User.findByPk(req.params.id)
  //     .then((user) => {
  //       user.update({
  //         isAdmin: !user.isAdmin
  //       }).then((user) => {
  //         return res.json({ status: 'success', msg: 'Toggled user admin.' })
  //       })
  //     })
  // },

  // searchUser: (req, res) => {
  //   // 電話不為空值
  //   if (!req.query.phone) {
  //     return res.json({ status: 'error', msg: '請輸入電話!' })
  //   }
  //   // 搜尋單一會員，且排除管理者
  //   User.scope('excludedAdmin').findOne({ where: { phone: req.query.phone } }).then(user => {
  //     if (!user) {
  //       return res.json({ status: 'error', msg: '查無資料!確認電話是否輸入錯誤!' })
  //     }
  //     return res.json(user)
  //   })
  // },

  // searchPhone: (req, res) => {
  //   if (req.query.phone == null) {
  //     return res.json({ status: 'error', msg: 'Input field should not be blank!' })
  //   }
  //   User.findOne({ where: { name: req.query.phone } }).then(user => {
  //     if (user == null) {
  //       return res.json({ status: 'error', msg: 'Can find the the user phone!' })
  //     }
  //     return res.json(user)
  //   })
  // },

}

module.exports = userController