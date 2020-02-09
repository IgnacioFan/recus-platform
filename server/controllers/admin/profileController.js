const db = require('../../models')
const { User, Profile } = db
// upload avatar
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const profileController = {
  getProfile: (req, res) => {
    try {
      User.findByPk(req.user.id, {
        attributes: ['account', 'phone', 'createdAt'],
        include: [
          { model: Profile, attributes: ['name', 'email', 'avatar'] },
          // { model: Tag, as: 'preferredTags' }
        ]
      }).then(user => {
        return res.json({ user: user })
      })
    } catch (error) {
      return res.status(500).json({ status: 'error', msg: error })
    }
  },

  updateProfile: async (req, res) => {
    try {
      let { account, phone, name, email, avatar } = req.body

      user = await User.findByPk(req.user.id, {
        attributes: ['id', 'account', 'phone', 'password'],
        include: [Profile]
      })

      await user.update({
        account: account,
        phone: phone,
      })

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
}

module.exports = profileController