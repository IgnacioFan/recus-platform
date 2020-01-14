const bcrypt = require('bcryptjs')
const db = require('../../models')
const { User, Profile, Order } = db
const Op = require('sequelize').Op

// Json Web Token
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
// 
// const ExtractJwt = passportJWT.ExtractJwt
// const JwtStrategy = passportJWT.Strategy

const userController = {
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
      //console.log(user)
      if (!user) return res.status(401).json({ status: 'error', msg: '找不到該使用者！' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', msg: '密碼錯誤！' })
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
      console.log('輸入兩組不同密碼')
      return res.json({ status: 'error', msg: '輸入兩組不同密碼！' })
    } else {
      User.create({
        account: req.body.account,
        phone: req.body.phone,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
      }).then(user => {
        console.log(user)
        Profile.create({
          name: req.body.name,
          email: req.body.email,
          UserId: user.id
        })
      }).then(user => {
        return res.json({ status: 'success', msg: '帳號註冊成功！' })
      })
    }
  },

  getCurrentUser: (req, res) => {

    if (!req.headers.authorization) {
      return res.json({ status: 'error', msg: '使用者未得授權！' })
    }

    let TokenArray = req.headers.authorization.split(" ");
    let authorization = TokenArray[1]
    //console.log(req.headers)
    jwt.verify(authorization, process.env.JWT_SECRET, (err, authorizedData) => {
      
      User.findOne({
        include: [Profile],
        where: { id: authorizedData.id }
      }).then(user => {
        //console.log(user)

        return res.json({
          id: user.id,
          account: user.account,
          phone: user.phone,
          role: user.role,
          name: user.Profile.name,
          avatar: user.Profile.avatar
        })
      })
    })
  }
}

module.exports = userController