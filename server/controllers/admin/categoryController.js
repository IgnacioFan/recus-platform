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
    return Category.findByPk(req.params.id, { include: [{ model: Dish, limit: 6 }] })
      .then(category => {
        return res.json(category)
      })
  }
}

module.exports = categoryController