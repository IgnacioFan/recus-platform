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
    try {
      let { username, password } = req.body

      User.findOne({
        where: {
          [Op.or]: [
            { account: username },
            { phone: username }
          ]
        }
      }).then(user => {
        if (!user) return res.status(404).json({ status: 'error', msg: '查無此帳號!' })
        if (!bcrypt.compareSync(password, user.password))
          return res.status(401).json({ status: 'error', msg: '密碼輸入錯誤!' })
        if (user.isValid === false) return res.status(403).json({ status: 'error', msg: '此帳號已停權!' })
        // sign a token to accessible user
        var payload = { id: user.id }
        var token = jwt.sign(payload, process.env.JWT_SECRET)
        return res.json({
          status: 'success',
          msg: 'ok',
          token: token,
          user: {
            id: user.id,
            phone: user.phone,
            isValid: user.isValid,
            role: user.role
          }
        })
      })
    } catch (error) {
      return res.status(500).json({ status: 'error', msg: error })
    }
  },

  signUp: async (req, res) => {
    try {
      let { account, phone, password, passwordCheck, name, email, avatar } = req.body

      if (passwordCheck !== password) {
        //console.log('輸入兩組不同密碼')
        return res.status(401).json({ status: 'error', msg: '輸入兩組不同密碼!' })
      }
      else {
        user = await User.create({
          account: account,
          phone: phone,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
        })
        if (user) {
          profile = await Profile.create({
            name: name,
            email: email,
            avatar: avatar,
            UserId: user.id
          })
        }

        return res.json({ status: 'success', msg: '註冊成功!' })
      }
    } catch (error) {
      return res.status(500).json({ status: 'error', msg: error })
    }
  },

  getCurrentUser: (req, res) => {
    try {
      if (!req.headers.authorization) {
        return res.status(401).json({ status: 'error', msg: '未得授權!' })
      }

      let TokenArray = req.headers.authorization.split(" ");
      let authorization = TokenArray[1]
      //console.log(req.headers)
      jwt.verify(authorization, process.env.JWT_SECRET, (err, authorizedData) => {

        User.findByPk(authorizedData.id, {
          attributes: [
            'phone', 'role',
            [db.sequelize.literal("(SELECT name FROM Profiles WHERE Profiles.UserId = User.id)"), 'name'],
            [db.sequelize.literal("(SELECT avatar FROM Profiles WHERE Profiles.UserId = User.id)"), 'avatar']
          ]
        }).then(user => {
          return res.json({
            phone: user.dataValues.phone,
            role: user.dataValues.role,
            name: user.dataValues.name,
            avatar: user.dataValues.avatar
          })
        })
      })
    } catch (error) {
      return res.status(500).json({ status: 'error', msg: error })
    }
  }
}

module.exports = userController