const db = require('../../models')
const Dish = db.Dish
const Category = db.Category


const dishController = {
  getDish: (req, res) => {
    let whereQuery = {}
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery['CategoryId'] = categoryId
    }
    return Dish.findAll({ where: whereQuery }).then(dishes => {
      return res.json(dishes)
    })
  }
}

module.exports = dishController