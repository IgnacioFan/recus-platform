const db = require('../../models')
const { Category, Dish } = db

const categoryController = {
  getCategories: (req, res) => {
    return Category.findAll({ include: [Dish] })
      .then(categories => {
        // 加上菜單數量的attribute
        categories = categories.map(item => ({
          ...item.dataValues,
          nums: !item.dataValues.Dishes ? 0 : item.dataValues.Dishes.length
        }))
        return res.json({ categories: categories })
      })
  },

  getCategory: (req, res) => {
    return Category.findByPk(req.params.id, { include: [Dish] })
      .then(category => {
        return res.json({ category: category })
      })
  },

  addCategory: (req, res) => {
    //if (!req.body.name) return res.json({ status: 'error', msg: '請輸入分類名稱!' })
    Category.findOrCreate({ where: { name: req.body.name }, defaults: { name: req.body.name } })
      .then(([category, created]) => {
        if (created === true) return res.json({ status: 'success', msg: `${category.name}新增成功!` })
        return res.json({ status: 'error', msg: '分類已建立!' })
      })
  },

  updateCategory: (req, res) => {
    //if (!req.body.name) return res.json({ status: 'error', msg: '請輸入分類名稱!' })
    Category.findByPk(req.params.id).then((category) => {
      // 如果名稱一致
      if (category.name === req.body.name) return res.json({ status: 'error', msg: '分類已建立!' })
      category.update({ name: req.body.name })
      return res.json({ status: 'success', msg: `${category.name}新增成功!` })
    })
  },

  removeCategory: (req, res) => {
    Category.findByPk(req.params.id).then((category) => {
      // 如果category是空值
      if (!category) return res.json({ status: 'error', msg: '查無資料!' })
      category.destroy()
      return res.json({ status: 'success', msg: `成功移除${category.name}!` })
    })
  }
}

module.exports = categoryController