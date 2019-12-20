const db = require('../../models')
const Dish = db.Dish
const Category = db.Category


const dishController = {
  getDish: (req, res) => {
    return Dish.findAll({ where: { CategoryId: req.params.id }, limit: 6 }).then(dishes => {
      return res.json(dishes)
    })
  }
}

module.exports = dishController

