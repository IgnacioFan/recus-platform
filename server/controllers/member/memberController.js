const db = require('../../models')
const { User, Profile, Tag, UserPreferred } = db
const Op = require('sequelize').Op
// upload avatar
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const memberController = {
  testRoute: (req, res) => {
    return res.json({ status: 'success', msg: '路徑測試！' })
  },

  getProfile: (req, res) => {
    try {
      User.findByPk(req.user.id, {
        attributes: ['account', 'phone', 'createdAt'],
        include: [
          { model: Profile, attributes: ['name', 'email', 'avatar'] },
          { model: Tag, as: 'preferredTags' }]
      }).then(user => {
        return res.json({ user: user })
      })
    } catch (error) {
      return res.status(500).json({ status: 'error', msg: error })
    }
  },

  updateProfile: async (req, res) => {
    try {
      let { account, phone, name, email, avatar, tags } = req.body

      user = await User.findByPk(req.user.id, {
        attributes: ['id', 'account', 'phone', 'password'],
        include: [Profile]
      })

      await user.update({
        account: account,
        phone: phone,
      })

      if (tags) {
        await UserPreferred.destroy({ where: { UserId: req.user.id } })

        for (let i = 0; i < tags.length; i++) {
          await UserPreferred.create({ TagId: tags[i].id, UserId: req.user.id })
        }
      }

      const { file } = req

      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(file.path, async (err, avatar) => {
          await user.Profile.update({
            name: name,
            email: email,
            avatar: avatar.data.link
          })
          return res.json({ status: 'success', msg: '圖片上傳/更新成功!' })
        })
      }
      else {
        await user.Profile.update({
          name: name,
          email: email,
          avatar: avatar
        })
        return res.json({ status: 'success', msg: '更新成功!' })
      }
    } catch (error) {
      return res.status(500).json({ status: 'error', msg: error })
    }
  },

  getTags: (req, res) => {
    try {
      Tag.findAll().then(tags => {
        return res.json(tags)
      })
    } catch (error) {
      return res.status(500).json({ status: 'error', msg: error })
    }
  },

  searchTag: (req, res) => {
    try {
      // console.log(`%${req.query}%`)
      Tag.findAll({
        where: {
          name: {
            [Op.like]: `%${req.query.name}%`
          }
        }
      }).then(tag => {
        return res.json(tag)
      })
    } catch (error) {
      return res.status(500).json({ status: 'error', msg: error })
    }
  }
}

module.exports = memberController