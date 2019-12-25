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
      db.Order.scope('todayOrder').findOne().then(function (order) {
        //console.log(order)
        expect(data.id).to.be.equal(order.id)
        //expect(data.createdAt).to.be.match(order.createdAt)
        done()
      })
    })

    it('update the amount and quantity', (done) => {
      db.Order.update({ amount: 120, quantity: 3, createdAt: new Date().setMinutes(8) }, { where: { id: data.id } }).then(() => {
        db.Order.scope('todayOrder').findOne().then((order) => {
          //console.log(order)
          expect(data.amount).to.be.not.equal(order.amount)
          expect(data.quantity).to.be.not.equal(order.quantity)
          expect(data.createdAt).to.be.not.equal(order.createdAt)
          done()
        })
      })
    })

    it('delete', (done) => {
      db.Order.destroy({ where: { id: data.id } }).then(() => {
        db.Order.findByPk(data.id).then((order) => {
          expect(order).to.be.equal(null)
          done()
        })
      })
    })
  })
})