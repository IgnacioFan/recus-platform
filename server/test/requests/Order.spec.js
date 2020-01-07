process.env.NODE_ENV = 'test'

var chai = require('chai')
var request = require('supertest')
var sinon = require('sinon')
var app = require('../../app')

var helpers = require('../../_helpers');
var should = chai.should();
var expect = chai.expect;
const db = require('../../models')
const order1 = {
  quantity: 4,
  amount: 140,
  memo: 'this is first order',
  tableNum: 2,
  isTakingAway: false,
  UserId: 1,
  dishes: [{ id: 1, quantity: 2, price: 30 }, { id: 1, quantity: 2, price: 40 }]
}
const order2 = {
  quantity: 3,
  amount: 90,
  memo: 'this is second order',
  tableNum: 0,
  isTakingAway: true,
  UserId: 1,
  dishes: [{ id: 1, quantity: 2, price: 30 }, { id: 1, quantity: 1, price: 30 }]
}


describe('# Admin::Order Request', () => {
  xcontext('go to Cart-Management feature', () => {

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
          console.log(res.body)
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
      await db.Order.create(order1)
      await db.Order.create(order2)
    })

    xit('should get all orders', (done) => {
      request(app)
        .get('/api/admin/orders?state=pending')
        .expect(200)
        .end((err, res) => {
          console.log(res.body.orders)
          expect(res.body).to.have.property('orders')
          expect(res.body.orders.length).to.be.equal(2)
          // expect(res.body.users[0].account).to.be.equal('root1')
          // expect(res.body.users[1].account).to.be.equal('user1')
          return done()
        })
    })

    it('should get order 1', (done) => {
      request(app)
        .get('/api/admin/orders/1')
        .expect(200)
        .end((err, res) => {
          console.log(res.body)
          expect(res.body).to.have.property('order')
          //expect(res.body.orders.length).to.be.equal(2)
          // expect(res.body.users[0].account).to.be.equal('root1')
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
})