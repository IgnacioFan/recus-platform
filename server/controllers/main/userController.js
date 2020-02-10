const bcrypt = require('bcryptjs')
const db = require('../../models')
const { User, Profile } = db
const Op = require('sequelize').Op

// Json Web Token
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
// upload avatar
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {
  signIn: (req, res) => {
    try {
      let { account, password } = req.body

      User.findOne({
        where: {
          [Op.or]: [
            { account: account },
            { phone: account }
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
      let { account, phone, password, passwordCheck, name, email } = req.body

      if (passwordCheck !== password) {
        return res.status(401).json({ status: 'error', msg: '密碼不一致!' })
      }
      else {
        user = await User.create({
          account: account,
          phone: phone,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
        })

        const { file } = req

        if (user) {
          if (file) {
            imgur.setClientID(IMGUR_CLIENT_ID)
            imgur.upload(file.path, async (err, avatar) => {
              await Profile.create({
                name: name,
                email: email,
                avatar: avatar.data.link,
                UserId: user.id
              })
              return res.json({ status: 'success', msg: '圖片上傳/註冊成功!' })
            })
          }
          else {
            await Profile.create({
              name: name,
              email: email,
              avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
              UserId: user.id
            })
            return res.json({ status: 'success', msg: '註冊成功!' })
          }
        }
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
  },

  changePassword: (req, res) => {
    try {
      let { passwordOld, passwordNew, passwordCheck } = req.body
      if (passwordCheck !== passwordNew)
        return res.status(401).json({ status: 'error', msg: '密碼不一致!' })

      if (!req.headers.authorization)
        return res.status(401).json({ status: 'error', msg: '未得授權!' })

      let TokenArray = req.headers.authorization.split(" ");
      let authorization = TokenArray[1]

      jwt.verify(authorization, process.env.JWT_SECRET, (err, authorizedData) => {
        User.findByPk(authorizedData.id, {
          attributes: ['id', 'password']
        }).then(user => {
          if (!bcrypt.compareSync(passwordOld, user.password))
            return res.status(401).json({ status: 'error', msg: '密碼輸入錯誤!' })

          user.update({
            password: bcrypt.hashSync(passwordNew, bcrypt.genSaltSync(10), null)
          })
          return res.json({ status: 'success', msg: '密碼成功更新!' })
        })
      })
    } catch (error) {
      return res.status(500).json({ status: 'error', msg: error })
    }
  }
}

module.exports = userController