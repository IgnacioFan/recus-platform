const db = require('../../models')
const { Category, Dish } = db

const categoryController = {
  getCategories: (req, res) => {
    try {
      Category.findAll({ include: [Dish] })
        .then(categories => {
          // 加上菜單數量的attribute
          categories = categories.map(item => ({
            ...item.dataValues,
            nums: !item.dataValues.Dishes ? 0 : item.dataValues.Dishes.length
          }))
          return res.json({ categories: categories })
        })
    } catch (error) {
      return res.status(500).json({ status: 'error', msg: error })
    }
  },

  getCategory: (req, res) => {
    try {
      return Category.findByPk(req.params.id, { include: [Dish] })
        .then(category => {
          return res.json({ category: category })
        })
    } catch (error) {
      return res.status(500).json({ status: 'error', msg: error })
    }
  },

  addCategory: (req, res) => {
    try {
      Category.findOrCreate({ where: { name: req.body.name }, defaults: { name: req.body.name } })
        .then(([category, created]) => {
          if (created === true) return res.json({ status: 'success', msg: `${category.name}新增成功!` })
          return res.json({ status: 'error', msg: '分類已建立!' })
        })
    } catch (error) {
      return res.status(500).json({ status: 'error', msg: error })
    }
  },

  updateCategory: (req, res) => {
    try {
      Category.findByPk(req.params.id).then((category) => {
        // 如果名稱一致
        if (category.name === req.body.name) return res.json({ status: 'error', msg: '分類已建立!' })
        category.update({ name: req.body.name })
        return res.json({ status: 'success', msg: `${category.name}新增成功!` })
      })
    } catch (error) {
      return res.status(500).json({ status: 'error', msg: error })
    }
  },

  removeCategory: (req, res) => {
    try {
      Category.findByPk(req.params.id).then((category) => {
        // 如果category是空值
        if (!category) return res.json({ status: 'error', msg: '查無資料!' })
        category.destroy()
        return res.json({ status: 'success', msg: `成功移除${category.name}!` })
      })
    } catch (error) {
      return res.status(500).json({ status: 'error', msg: error })
    }
  }
}

module.exports = categoryController