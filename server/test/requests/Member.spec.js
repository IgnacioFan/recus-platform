process.env.NODE_ENV = 'test'

var chai = require('chai')
var request = require('supertest')
var sinon = require('sinon')
var app = require('../../app')

var helper = require('../../_helpers');
var should = chai.should();
var expect = chai.expect;
const db = require('../../models')
const admin = { account: 'root1', phone: '0900', password: '12345', role: 'admin' }
const member1 = { account: 'user1', phone: '0901', password: '12345', role: 'member' }
const member2 = { account: 'user2', phone: '0902', password: '12345', role: 'member' }
const profi1 = { name: 'ryu', email: 'ryu@example.com', UserId: 2 }
const profi2 = { name: 'yoshi', email: 'yoshi@example.com', UserId: 3 }
const newMember = {
  account: 'user3', phone: '0903', password: '12345', passwordCheck: '12345',
  name: 'tim', email: 'tim@example.com'
}
const tag1 = { name: "義式" }
const tag2 = { name: "手沖" }
const order1 = {
  quantity: 4,
  amount: 140,
  memo: 'this is first order',
  tableNum: 2,
  isTakingAway: false,
  UserId: 3
}
const order2 = {
  quantity: 3,
  amount: 100,
  memo: 'this is second order',
  tableNum: 0,
  isTakingAway: true,
  UserId: 3
}
const dishCombos = [
  { OrderId: 1, DishId: 1, perQuantity: 2, perAmount: 60 }, { OrderId: 1, DishId: 2, perQuantity: 2, perAmount: 80 },
  { OrderId: 2, DishId: 1, perQuantity: 2, perAmount: 60 }, { OrderId: 2, DishId: 2, perQuantity: 1, perAmount: 40 }]
const dishes = [{ name: 'mocha', price: 30, CategoryId: 1 }, { name: 'latie', price: 40, CategoryId: 1 }]


describe('# Admin::Member request', () => {

  context('go to Member-management feature', () => {

    describe('if admin sign in', () => {
      before(async () => {
        this.ensureAuthenticated = sinon.stub(
          helper, 'ensureAuthenticated'
        ).returns(true)
        this.getUser = sinon.stub(
          helper, 'getUser'
        ).returns({ id: 1, role: 'admin' })

        await db.User.create(admin)
        await db.User.create(member1)
        await db.User.create(member2)
        await db.Profile.create(profi1)
        await db.Profile.create(profi2)
        await db.Tag.create(tag1)
        await db.Tag.create(tag2)
        await db.Order.create(order1)
        await db.Order.create(order2)
        await db.UserPreferred.create({ UserId: 1, TagId: 1 })
        await db.UserPreferred.create({ UserId: 1, TagId: 2 })
        await db.UserPreferred.create({ UserId: 3, TagId: 1 })
        for (let i = 0; i < dishCombos.length; i++) {
          await db.DishCombination.create(dishCombos[i])
        }
        for (let i = 0; i < dishes.length; i++) {
          await db.Dish.create(dishes[i])
        }
      })

      it('should get a specific user who is not admin', (done) => {
        request(app)
          .get('/api/admin/members/3')
          .expect(200)
          .end((err, res) => {
            //console.log(res.body.user)
            expect(res.body).to.have.property('user')
            expect(res.body.user.account).to.be.equal('user2')
            return done()
          })
      })

      it('should search a specific user who is not admin', (done) => {
        request(app)
          .get('/api/admin/members/search?phone=0902')
          .expect(200)
          .end((err, res) => {
            //console.log(res.body.user)
            expect(res.body).to.have.property('user')
            expect(res.body.user.account).to.be.equal('user2')
            expect(res.body.user.Profile.name).to.be.equal('yoshi')
            return done()
          })
      })

      it('should get orders from member 3', (done) => {
        request(app)
          .get('/api/admin/members/3/orders')
          .expect(200)
          .end((err, res) => {
            // console.log(res.body.orders)
            expect(res.body.orders.length).to.be.equal(2)
            expect(res.body.orders[0].sumOfDishes.length).to.be.equal(2)
            expect(res.body.orders[1].sumOfDishes.length).to.be.equal(2)
            return done()
          })
      })

      it('should get tags from member 3', (done) => {
        request(app)
          .get('/api/admin/members/3/tags')
          .expect(200)
          .end((err, res) => {
            //console.log(res.body)
            expect(res.body.tags[0].name).to.be.equal('義式')
            return done()
          })
      })

      it('should get user pagination', (done) => {
        request(app)
          .get('/api/admin/members?page=1')
          .expect(200)
          .end((err, res) => {
            //console.log(res.body.users)
            // console.log(res.body.users[1])
            // console.log(res.body.users[2])
            // console.log(res.body.users[0].MemberOrders.length)
            expect(res.body).to.have.property('users')
            // order as 'ASC'
            expect(res.body.users[0].account).to.be.equal('root1')
            // expect(res.body.users[0].Orders.length).to.be.equal(0)
            // expect(res.body.users[0].preferredTags.length).to.be.equal(2)
            expect(res.body.users[1].account).to.be.equal('user1')
            // expect(res.body.users[1].Orders.length).to.be.equal(2)
            // expect(res.body.users[1].preferredTags.length).to.be.equal(1)
            expect(res.body.users[2].account).to.be.equal('user2')
            // expect(res.body.users[2].Orders.length).to.be.equal(0)
            // expect(res.body.users[2].preferredTags.length).to.be.equal(0)
            return done()
          })
      })

      it('should add a new member manually', (done) => {
        request(app)
          .post('/api/admin/members')
          .send(newMember)
          .expect(200)
          .end((err, res) => {
            //console.log(res.body)
            expect(res.body.msg).to.be.include('註冊成功！')
            expect(res.body.user.account).to.be.include('user3')
            return done()
          })
      })

      it('should not delete member 1', (done) => {
        request(app)
          .delete('/api/admin/members/1')
          .expect(200)
          .end((err, res) => {
            //console.log(res.body)
            expect(res.body.msg).to.be.include('cannot delete!')
            return done()
          })
      })

      it('should delete member 3', (done) => {
        request(app)
          .delete('/api/admin/members/6')
          .expect(200)
          .end((err, res) => {
            // console.log(res.text)
            expect(res.body)
            expect(res.text).to.be.include('user not existed!')
            return done()
          })
      })

      it('should change role of member 2 to admin', (done) => {
        request(app)
          .put('/api/admin/members/2/isAdmin')
          .expect(200)
          .end((err, res) => {
            //console.log(res.body)
            expect(res.body.user.role).to.be.equal('admin')
            expect(res.body.msg).to.be.equal('successfully role changed!')
            return done()
          })
      })

      it('should change validation of member 2', (done) => {
        request(app)
          .put('/api/admin/members/2/isValid')
          .expect(200)
          .end((err, res) => {
            //console.log(res.body)
            expect(res.body.user.isValid).to.be.equal(false)
            expect(res.body.msg).to.be.equal('successfully valid changed!')
            return done()
          })
      })

      after(async () => {
        this.ensureAuthenticated.restore()
        this.getUser.restore()
        await db.User.destroy({ where: {}, force: true, truncate: true })
        await db.Profile.destroy({ where: {}, truncate: true })
        await db.Tag.destroy({ where: {}, truncate: true })
        await db.Order.destroy({ where: {}, force: true, truncate: true })
        await db.UserPreferred.destroy({ where: {}, truncate: true })
        await db.DishCombination.destroy({ where: {}, truncate: true })
        await db.Dish.destroy({ where: {}, truncate: true })
      })
    })

  })
})