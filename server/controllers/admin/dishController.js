const db = require('../../models')
const { Dish, DishAttachment, Category, Tag } = db
//const Category = db.Category


const dishController = {
  // 取得某分類的所有品項
  getDishWithCategory: (req, res) => {
    try {
      if (Number(req.query.categoryId) < 1) {
        return res.json({ status: 'error', msg: 'undefined category id' })
      }

      let whereQuery = {
        CategoryId: req.query.categoryId
      }

      Dish.findAll({ where: whereQuery }).then(dishes => {
        return res.json({ dishes: dishes })
      })
    } catch (error) {
      return res.status(500).json({ status: 'error', msg: error })
    }
  },

  // 取得單筆菜單的品項
  getDish: (req, res) => {
    try {
      if (Number(req.params.categoryId) < 1) {
        return res.json({ status: 'error', msg: 'undefined dish id' })
      }
      Dish.findByPk(req.params.id,
        { include: [Category, { model: Tag, as: 'hasTags', through: { attributes: [] } }] })
        .then(dish => {
          return res.json({ dish: dish })
        })
    } catch (error) {
      return res.status(500).json({ status: 'error', msg: error })
    }
  },

  // postDish 新增一筆品項
  addDish: (req, res) => {
    try {
      let { tags, name, price, image, description, CategoryId } = req.body

      if (!name && !price)
        return res.json({ status: 'error', msg: 'dish name and price cannot be blank' })

      if (!CategoryId)
        return res.json({ status: 'error', msg: 'category cannot be blank' })

      if (Number(price) < 0)
        return res.json({ status: 'error', msg: 'price can not be negative' })

      let dishObj = {
        name: name,
        price: price,
        image: image,
        description: description,
        CategoryId: CategoryId
      }

      Dish.create(dishObj).then(dish => {
        let arr = []
        if (tags) {
          tags.forEach(tag => {
            DishAttachment.create({ TagId: tag.id, DishId: dish.id })
            arr.push({ TagId: tag.id, DishId: dish.id })
          })
        }
        return res.json({ status: 'success', msg: '成功新增菜單!', dish: dish, tags: arr })
      })
    } catch (error) {
      return res.status(500).json({ status: 'error', msg: error })
    }
  },

  // updateDish 更新某筆品項
  updateDish: async (req, res) => {
    try {
      let { tags, name, price, image, description, CategoryId } = req.body

      let dishObj = {
        name: name,
        price: price,
        image: image,
        description: description,
        CategoryId: CategoryId
      }

      dish = await Dish.findByPk(req.params.id)

      await DishAttachment.destroy({ where: { DishId: dish.id } })

      if (tags) {
        for (let i = 0; i < tags.length; i++) {
          await DishAttachment.create({ DishId: dish.id, TagId: tags[i].id })
        }
      }

      await dish.update(dishObj)

      return res.json({ status: 'success', msg: '更新菜單品項!', dish: dish })
    } catch (error) {
      return res.status(500).json({ status: 'error', msg: error })
    }
  },

  removeDish: async (req, res) => {
    try {
      dish = await Dish.findByPk(req.params.id)
      await DishAttachment.destroy({ where: { DishId: dish.id } })
      await dish.destroy()
      return res.json({ status: 'success', msg: `已刪除${dish.name}！` })
    } catch (error) {
      return res.status(500).json({ status: 'error', msg: error })
    }
  }
}

module.exports = dishController