const db = require('../../models')
const Category = db.Category
const Dish = db.Dish

const categoryController = {
  getCategories: (req, res) => {
    return Category.findAll().then(categories => {
      return res.json(categories)
    })
  },
  getCategory: (req, res) => {
    return Category.findByPk(req.params.id)
      .then(category => {
        return res.json(category)
      })
  },

  addCategory: (req, res) => {
    if (!req.body.name) return res.json({ status: 'error', msg: '請輸入分類名稱' })
    Category.create({ name: req.body.name }).then((category) => {
      return res.json({ status: 'success', msg: `${category.name}新增成功` })
    })
  },

  updateCategory: (req, res) => {
    if (!req.body.name) return res.json({ status: 'error', msg: '請輸入分類名稱' })
    Category.findByPk(req.params.id).then((category) => {
      // 如果與原名稱一致
      if (category.name === req.body.name) return res.json({ status: 'error', msg: '不必寫入' })
      category.update({ name: req.body.name })
      return res.json({ status: 'success', msg: `${category.name}新增成功` })
    })
  },

  removeCategory: (req, res) => {
    Category.findByPk(req.params.id).then((category) => {
      // 如果category是空值
      if (!category) return res.json({ status: 'error', msg: '查無資料' })
      category.destroy()
      return res.json({ status: 'success', msg: `${category.name}刪除成功` })
    })
  }
}

module.exports = categoryController