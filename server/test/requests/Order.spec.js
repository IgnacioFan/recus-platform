process.env.NODE_ENV = 'test'

var chai = require('chai')
var request = require('supertest')
var sinon = require('sinon')
var app = require('../../app')

var helpers = require('../../_helpers');
var should = chai.should();
var expect = chai.expect;
const db = require('../../models')
var tk = require('timekeeper')
//var time = new Date(1893448800000)
var time = new Date()

const order1 = {
  quantity: 4,
  amount: 140,
  memo: 'this is first order',
  tableNum: 2,
  isTakingAway: false,
  UserId: 1,
  //createdAt: new Date().setHours(10, 0, 0, 0)
}
const order2 = {
  quantity: 3,
  amount: 100,
  memo: 'this is second order',
  tableNum: 0,
  isTakingAway: true,
  UserId: 1,
  //createdAt: new Date().setHours(12, 0, 0, 0)
}
const dishCombo1 = [{ id: 1, quantity: 2, price: 30 }, { id: 2, quantity: 2, price: 40 }]
const dishCombo2 = [{ id: 1, quantity: 2, price: 30 }, { id: 2, quantity: 1, price: 40 }]
const dish1 = { name: 'mocha', price: 30, CategoryId: 1 }
const dish2 = { name: 'latie', price: 40, CategoryId: 1 }

describe('# Admin::Order Request', () => {
  context('go to Order-Management feature', () => {

    before(async () => {
      this.ensureAuthenticated = sinon.stub(
        helpers, 'ensureAuthenticated'
      ).returns(true)
      this.getUser = sinon.stub(
        helpers, 'getUser'
      ).returns({ id: 1, role: 'admin' })
      await db.Order.destroy({ where: {}, force: true, truncate: true, })
      await db.DishCombination.destroy({ where: {}, truncate: true })
      await db.User.destroy({ where: {}, force: true, truncate: true })
      //await db.User.create({ account: 'user1', phone: '09000', password: '12345678' })
    })

    it('should add a new order in cart', (done) => {
      request(app)
        .post('/api/admin/orders')
        .send({
          quantity: 3,
          amount: 100,
          memo: 'this is a new order',
          tableNum: 2,
          isTakingAway: false,
          UserId: 1,
          dishes: [{ id: 1, quantity: 2, price: 30 }, { id: 1, quantity: 1, price: 40 }]
        })
        .expect(200)
        .end((err, res) => {
          //console.log(res.body.order)
          expect(res.body).to.have.property('order')
          //expect(res.body.order.state).to.be.equal('pending')
          expect(res.body.order.amount).to.be.equal(100)
          // expect(res.body.users[1].account).to.be.equal('user1')
          return done()
        })
    })

    after(async () => {
      this.ensureAuthenticated.restore()
      this.getUser.restore()
      await db.Order.destroy({ where: {}, force: true, truncate: true })
      await db.DishCombination.destroy({ where: {}, truncate: true })
      await db.User.destroy({ where: {}, force: true, truncate: true })
    })
  })

  context('go to Order-Management feature', () => {

    before(async () => {
      this.ensureAuthenticated = sinon.stub(
        helpers, 'ensureAuthenticated'
      ).returns(true)
      this.getUser = sinon.stub(
        helpers, 'getUser'
      ).returns({ id: 1, role: 'admin' })
      await db.Order.destroy({ where: {}, force: true, truncate: true, })
      await db.DishCombination.destroy({ where: {}, truncate: true })
      await db.User.destroy({ where: {}, force: true, truncate: true })
      await db.Dish.create(dish1)
      await db.Dish.create(dish2)
      await db.Order.create(order1)
      for (let i = 0; i < dishCombo1.length; i++) {
        await db.DishCombination.create({
          DishId: dishCombo1[i].id,
          OrderId: 1,
          perAmount: dishCombo1[i].price,
          perQuantity: dishCombo1[i].quantity
        })
      }
      await db.Order.create(order2)
      for (let i = 0; i < dishCombo2.length; i++) {
        await db.DishCombination.create({
          DishId: dishCombo2[i].id,
          OrderId: 2,
          perAmount: dishCombo2[i].price,
          perQuantity: dishCombo2[i].quantity
        })
      }
      //tk.travel(time)
      //tk.freeze(time)
    })

    it('should get all orders today', (done) => {
      request(app)
        .get('/api/admin/orders?state=pending')
        .expect(200)
        .end((err, res) => {
          console.log(res.body.orders)
          expect(res.body).to.have.property('orders')
          expect(res.body.orders.length).to.be.equal(2)
          expect(res.body.orders[1].sumOfDishes.length).to.be.equal(2)
          expect(res.body.orders[1].sumOfDishes[0].DishCombination.perQuantity).to.be.equal(2)
          expect(res.body.orders[1].sumOfDishes[1].DishCombination.perQuantity).to.be.equal(2)
          expect(res.body.orders[0].sumOfDishes.length).to.be.equal(2)
          return done()
        })
    })


    xit('should get no any order today', (done) => {
      //time = new Date(1893448800000)

      request(app)
        .get('/api/admin/orders?state=pending')
        .expect(200)
        .end((err, res) => {
          console.log(res.body.orders)
          let date1 = new Date
          let ms = Date.now()
          console.log(date1, ms)
          expect(res.body).to.have.property('orders')
          expect(res.body.orders.length).to.be.equal(2)
          return done()
        })
    })

    it('should get order 1', (done) => {
      request(app)
        .get('/api/admin/orders/1')
        .expect(200)
        .end((err, res) => {
          //console.log(res.body.order)
          expect(res.body).to.have.property('order')
          expect(res.body.order.amount).to.be.equal(140)
          expect(res.body.order.sumOfDishes[0].DishCombination.perQuantity).to.be.equal(2)
          expect(res.body.order.sumOfDishes[1].DishCombination.perQuantity).to.be.equal(2)
          return done()
        })
    })

    after(async () => {
      this.ensureAuthenticated.restore()
      this.getUser.restore()
      await db.Order.destroy({ where: {}, force: true, truncate: true })
      await db.DishCombination.destroy({ where: {}, truncate: true })
      await db.Dish.destroy({ where: {}, truncate: true })
      await db.User.destroy({ where: {}, force: true, truncate: true })
      tk.reset()
    })
  })
})