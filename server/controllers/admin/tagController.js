
const db = require('../../models')
const { Tag } = db

const tagController = {
  getTags: (req, res) => {
    Tag.findAll().then(tags => {
      return res.json(tags)
    })
  },

  addTag: (req, res) => {
    if (!req.body.name) return res.json({ status: 'error', msg: '請輸入標籤名稱' })
    Tag.findOne({ where: { name: req.body.name } }).then(tag => {
      if (tag === null) {
        return Tag.create({ name: req.body.name }).then(tag => {
          //console.log(tag)
          return res.json(tag)
        })
      }
      else {
        return res.json({ status: 'error', msg: '標籤已建立' })
      }
    })
  },

  updateTag: (req, res) => {
    if (!req.body.name) return res.json({ status: 'error', msg: '請輸入標籤名稱' })
    Tag.findByPk(req.params.id).then(tag => {
      if (tag.name === req.body.name) {
        return res.json({ status: 'error', msg: '標籤名稱相同' })
      } else {
        tag.update({ name: req.body.name })
        return res.json(tag)
      }
    })
  },

  deleteTag: (req, res) => {
    Tag.findByPk(req.params.id).then(tag => {
      tag.destroy()
      return res.json({ status: 'error', msg: `成功移除${tag.name}`, tag: tag })
    })
  }

}

module.exports = tagController