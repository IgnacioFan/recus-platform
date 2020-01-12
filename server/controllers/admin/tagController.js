const db = require('../../models')
const { Tag, Dish } = db
const Op = require('sequelize').Op

const tagController = {
  getTags: (req, res) => {
    Tag.findAll({ include: { model: Dish, as: 'hasDishes' } }).then(tags => {
      // 加上菜單數量屬性
      tags = tags.map((tag) => ({
        ...tag.dataValues,
        nums: !tag.hasDishes ? 0 : tag.hasDishes.length
      }))
      return res.json({ tags: tags })
    })
  },
  // unmodify
  searchTag: (req, res) => {
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
  },
  // unmodify
  getTag: (req, res) => {
    Tag.findByPk(req.params.id).then(tag => {
      return res.json(tag)
    })
  },

  addTag: (req, res) => {
    //if (!req.body.name) return res.json({ status: 'error', msg: '請輸入標籤名稱' })
    Tag.findOrCreate({ where: { name: req.body.name }, defaults: { name: req.body.name } })
      .then(([tag, created]) => {
        if (created === true) return res.json({ status: 'success', msg: `${tag.name}新增成功!` })
        return res.json({ status: 'error', msg: '標籤已建立!' })
      })
  },

  updateTag: (req, res) => {
    //if (!req.body.name) return res.json({ status: 'error', msg: '請輸入標籤名稱' })
    Tag.findByPk(req.params.id).then(tag => {
      if (tag.name === req.body.name) {
        return res.json({ status: 'error', msg: '標籤已建立!' })
      } else {
        tag.update({ name: req.body.name })
        return res.json({ tag: tag })
      }
    })
  },

  deleteTag: (req, res) => {
    Tag.findByPk(req.params.id).then(tag => {
      tag.destroy()
      return res.json({ status: 'error', msg: `成功移除${tag.name}!`, tag: tag })
    })
  }

}

module.exports = tagController