const db = require('../../models')
const { Tag, Dish, UserPreferred, DishAttachment } = db
const Op = require('sequelize').Op

const tagController = {
  getTags: (req, res) => {
    try {
      Tag.findAll({ include: { model: Dish, as: 'hasDishes' } }).then(tags => {
        // 加上菜單數量屬性
        tags = tags.map((tag) => ({
          ...tag.dataValues,
          nums: !tag.hasDishes ? 0 : tag.hasDishes.length
        }))
        return res.json({ tags: tags })
      })
    } catch (error) {
      return res.status(500).json({ status: 'error', msg: error })
    }
  },
  // unmodify
  searchTag: (req, res) => {
    try {
      console.log(`%${req.query}%`)
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
  },
  // unmodify
  getTag: (req, res) => {
    try {
      Tag.findByPk(req.params.id).then(tag => {
        return res.json(tag)
      })
    } catch (error) {
      return res.status(500).json({ status: 'error', msg: error })
    }
  },

  addTag: (req, res) => {
    //if (!req.body.name) return res.json({ status: 'error', msg: '請輸入標籤名稱' })
    try {
      Tag.findOrCreate({ where: { name: req.body.name }, defaults: { name: req.body.name } })
        .then(([tag, created]) => {
          if (created === true) return res.json({ status: 'success', msg: `${tag.name}新增成功!` })
          return res.json({ status: 'error', msg: '標籤已建立!' })
        })
    } catch (error) {
      return res.status(500).json({ status: 'error', msg: error })
    }
  },

  updateTag: (req, res) => {
    //if (!req.body.name) return res.json({ status: 'error', msg: '請輸入標籤名稱' })
    try {
      Tag.findByPk(req.params.id).then(tag => {
        if (tag.name === req.body.name) {
          return res.json({ status: 'error', msg: '標籤已建立!' })
        } else {
          tag.update({ name: req.body.name })
          return res.json({ tag: tag })
        }
      })
    } catch (error) {
      return res.status(500).json({ status: 'error', msg: error })
    }
  },

  removeTag: async (req, res) => {
    try {
      tag = await Tag.findByPk(req.params.id)
      await UserPreferred.destroy({ where: { TagId: req.params.id } })
      await DishAttachment.destroy({ where: { TagId: req.params.id } })
      await tag.destroy()
      return res.json({ status: 'error', msg: `已刪除${tag.name}!`, tag: tag })
    } catch (error) {
      return res.status(500).json({ status: 'error', msg: error })
    }
  }

}

module.exports = tagController