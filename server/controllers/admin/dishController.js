const db = require('../../models')
const Dish = db.Dish
const Category = db.Category


const dishController = {
  getDish: (req, res) => {

    // if categoryId is 1,2,3,4
    if (Number(req.query.categoryId) <= 0) {
      return
    }
    return Dish.findAll({ where: { CategoryId: Number(req.query.categoryId) } }).then(dishes => {
      return res.json(dishes)
    })
  }
}

module.exports = dishController

