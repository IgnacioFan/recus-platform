process.env.NODE_ENV = 'test'

var chai = require('chai')
var sinon = require('sinon')
chai.use(require('sinon-chai'))

const { expect } = require('chai')

const {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists,
  checkUniqueIndex
} = require('sequelize-test-helpers')
const db = require('../../models')
const DishModel = require('../../models/dish')

describe('# Dish Model', () => {
  const Dish = DishModel(sequelize, dataTypes)
  const dish = new Dish()

  checkModelName(Dish)('Dish')

  context('properties', () => {
    ['name', 'price', 'image', 'description', 'option', 'CategoryId'].forEach(checkPropertyExists(dish))
  })

  context('indexes', () => {
    ['name'].forEach(checkUniqueIndex(dish))
  })

  context('check associations', function () {
    const Category = 'Category'
    const Tag = 'Tag'
    const Order = 'Order'
    const DishAttachment = 'DishAttachment'
    const DishCombination = 'DishCombination'

    before(() => {
      Dish.associate({ Category })
      Dish.associate({ Tag, DishAttachment })
      Dish.associate({ Order, DishCombination })
    })

    it('defined a belongsTo association with Category', () => {
      expect(Dish.belongsTo).to.have.been.calledWith(Category)
    })

    it("defined a hasMany association with Tag through DishAttachment as 'hasTags'", () => {
      expect(Dish.belongsToMany).to.have.been.calledWith(Tag, {
        through: DishAttachment,
        foreignKey: 'DishId',
        as: 'hasTags'
      })
    })

    it("defined a belongsToMany association with Order through DishCombination as 'sumOfOrder'", () => {
      expect(Dish.belongsToMany).to.have.been.calledWith(Order, {
        through: DishCombination,
        foreignKey: 'DishId',
        as: 'sumOfOrders'
      })
    })
  })

  context('CRUD', function () {
    let data = null

    it('create a new Dish must have name, price & categoryId', (done) => {
      db.Dish.create({ name: '美式', price: '60', CategoryId: '1' }).then((dish) => {
        data = dish
        done()
      })
    })

    it('read the Dish', (done) => {
      db.Dish.findByPk(data.id).then(function (dish) {
        expect(data.id).to.be.equal(dish.id)
        done()
      })
    })

    it('set a price range and get the Dish', (done) => {
      db.Dish.scope({ method: ['priceRange', 50, 80] }).findOne().then((dish) => {
        expect(Number(data.price)).to.be.equal(dish.price)
        done()
      })
    })

    it('update the price and dish name', (done) => {
      db.Dish.update({ name: '拿鐵', price: '80' }, { where: { id: data.id } }).then(() => {
        db.Dish.findByPk(data.id).then((dish) => {
          expect(data.name).to.be.not.equal(dish.name)
          expect(data.price).to.be.not.equal(dish.price)
          done()
        })
      })
    })

    it('set a price range and get the Dish', (done) => {
      db.Dish.scope({ method: ['priceRange', 50, 70] }).findOne().then((dish) => {
        expect(dish).to.be.equal(null)
        done()
      })
    })

    it('delete', (done) => {
      db.Dish.destroy({ where: { id: data.id } }).then(() => {
        db.Dish.findByPk(data.id).then((dish) => {
          expect(dish).to.be.equal(null)
          done()
        })
      })
    })
  })
})