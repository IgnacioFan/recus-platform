process.env.NODE_ENV = 'test'

var chai = require('chai')
var sinon = require('sinon')
chai.use(require('sinon-chai'))

const { expect } = require('chai')

const {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} = require('sequelize-test-helpers')
const db = require('../../models')
const OrderModel = require('../../models/order')

describe('# Order Model', function () {
  const Order = OrderModel(sequelize, dataTypes)
  const order = new Order()

  checkModelName(Order)('Order')

  context('properties', () => {
    ['tableNum', 'memo', 'amount', 'quantity', 'state', 'isTakingAway', 'UserId'].forEach(checkPropertyExists(order))
  })

  context('check associations', () => {
    const Dish = 'Dish'
    const MemberOrder = 'MemberOrder'
    const DishCombination = 'DishCombination'

    before(function () {
      Order.associate({ MemberOrder })
      Order.associate({ Dish, DishCombination })
    })

    it('defined a hasMany association with MemberOrder', () => {
      expect(Order.hasMany).to.have.been.calledWith(MemberOrder);
    })

    it("defined a belongsToMany association with Tag through OrderPreferred as 'preferredTags'", () => {
      expect(Order.belongsToMany).to.have.been.calledWith(Dish, {
        through: DishCombination,
        foreignKey: 'OrderId',
        as: 'sumOfDishes',
        hooks: true,
        onDelete: 'cascade'
      })
    })
  })

  context('CRUD', () => {
    let data = null

    it('create a new Order must have amount, quantity', (done) => {
      db.Order.create({ amount: 80, quantity: 2 }).then((order) => {
        data = order
        done()
      })
    })

    it('read the Order', (done) => {
      db.Order.findOne().then(function (order) {
        //console.log(order)
        expect(data.id).to.be.equal(order.id)
        //expect(data.createdAt).to.be.match(order.createdAt)
        done()
      })
    })

    it('update the amount and quantity', (done) => {
      db.Order.update({ amount: 120, quantity: 3 }, { where: { id: data.id } }).then(() => {
        db.Order.findOne().then((order) => {
          //console.log(order)
          expect(data.amount).to.be.not.equal(order.amount)
          expect(data.quantity).to.be.not.equal(order.quantity)
          expect(data.createdAt).to.be.not.equal(order.createdAt)
          done()
        })
      })
    })

    it('soft delete, the order exist', (done) => {
      db.Order.destroy({ where: { id: data.id } }).then(() => {
        db.Order.findByPk(data.id, { paranoid: false }).then((Order) => {
          expect(Order.deletedAt).to.be.not.equal(null)
          done()
        })
      })
    })

    it('forced delete, the Order is removed', (done) => {
      db.Order.destroy({ where: { id: data.id }, force: true }).then(() => {
        db.Order.findByPk(data.id).then((Order) => {
          expect(Order).to.be.equal(null)
          done()
        })
      })
    })
  })
})