process.env.NODE_ENV = 'test'

var chai = require('chai')
var request = require('supertest')
var sinon = require('sinon')
var app = require('../../app')

var helpers = require('../../_helpers');
var should = chai.should();
var expect = chai.expect;
const db = require('../../models')
const moment = require('moment')
var tk = require('timekeeper')
const nowTime = new Date()
const time = moment(nowTime, "YYYY-M-D H:m").subtract(1, 'days').toDate() //moment().subtract(1, 'days')

const tags = ["淺焙", "中焙", "深焙", "衣索比亞", "肯亞", "印尼", "微果酸", "果香味", "手沖", "義式機", "新品"] // 11
const menu = [
  { name: '黑框美式', price: 60, CategoryId: 1, tags: [{ id: 3 }, { id: 10 }, { id: 11 }] },
  { name: '卡布奇諾', price: 80, CategoryId: 1, tags: [{ id: 2 }, { id: 3 }, { id: 10 }] },
  { name: '小農拿鐵', price: 80, CategoryId: 1, tags: [{ id: 2 }, { id: 10 }, { id: 11 }] },
  { name: '花神', price: 100, CategoryId: 2, tags: [{ id: 2 }, { id: 5 }, { id: 7 }, { id: 9 }] },
  { name: '牧童', price: 100, CategoryId: 2, tags: [{ id: 3 }, { id: 4 }, { id: 8 }, { id: 9 }] },
  { name: '巧克力情人', price: 100, CategoryId: 2, tags: [{ id: 1 }, { id: 2 }, { id: 4 }, { id: 9 }] },
  { name: '皇后花園', price: 100, CategoryId: 2, tags: [{ id: 1 }, { id: 6 }, { id: 8 }, { id: 9 }] },
  { name: '耶加雪菲', price: 100, CategoryId: 2, tags: [{ id: 1 }, { id: 2 }, { id: 4 }, { id: 7 }, { id: 9 }] }
]
const orders = [
  {
    quantity: 3, amount: 240, memo: 'this is second order', isTakingAway: true, UserId: 1, createdAt: time,
    dishes: [{ id: 1, quantity: 1, price: 60 }, { id: 2, quantity: 1, price: 80 }, { id: 4, quantity: 1, price: 100 }]
  },
  {
    quantity: 2, amount: 200, memo: 'this is second order', isTakingAway: true, UserId: 2, createdAt: time,
    dishes: [{ id: 7, quantity: 2, price: 100 }]
  },
  {
    quantity: 3, amount: 300, memo: 'this is third order', isTakingAway: true, UserId: 1, createdAt: time,
    dishes: [{ id: 6, quantity: 2, price: 100 }, { id: 8, quantity: 1, price: 100 }]
  },
  {
    quantity: 3, amount: 220, memo: 'this is fourth order', isTakingAway: true, UserId: 1, createdAt: time,
    dishes: [{ id: 1, quantity: 2, price: 60 }, { id: 5, quantity: 1, price: 100 }]
  },
  {
    quantity: 4, amount: 380, memo: 'this is fifth order', isTakingAway: true, UserId: 3, createdAt: time,
    dishes: [{ id: 6, quantity: 3, price: 100 }, { id: 2, quantity: 1, price: 80 }]
  },
  {
    quantity: 2, amount: 200, memo: 'this is sixth order', isTakingAway: true, UserId: 2, createdAt: time,
    dishes: [{ id: 7, quantity: 1, price: 100 }, { id: 5, quantity: 1, price: 100 }]
  }
]
const member1 = { account: 'user1', phone: '0901', password: '12345', role: 'admin' }
const member2 = { account: 'user2', phone: '0902', password: '12345', role: 'member' }
const member3 = { account: 'user3', phone: '0903', password: '12345', role: 'member' }
const profi1 = { name: 'nacho', email: 'nacho@example.com', UserId: 2 }
const profi2 = { name: 'kirwen', email: 'kirwen@example.com', UserId: 3 }

describe('# Admin::Dashboard Request', () => {
  context('go to Dashboard feature', () => {

    before(async () => {
      this.ensureAuthenticated = sinon.stub(
        helpers, 'ensureAuthenticated'
      ).returns(true)
      this.getUser = sinon.stub(
        helpers, 'getUser'
      ).returns({ id: 1, role: 'admin' })

      await db.Tag.destroy({ where: {}, truncate: true })
      await db.Dish.destroy({ where: {}, truncate: true })
      await db.Order.destroy({ where: {}, force: true, truncate: true })
      await db.User.destroy({ where: {}, force: true, truncate: true })
      await db.DishCombination.destroy({ where: {}, truncate: true })
      await db.DishAttachment.destroy({ where: {}, truncate: true })
      await db.Profile.destroy({ where: {}, truncate: true })
      tk.freeze(time)
      await tags.forEach(tag => {
        db.Tag.create({ name: tag })
      })
      for (let i = 0; i < orders.length; i++) {
        await db.Order.create({
          quantity: orders[i].quantity, amount: orders[i].amount,
          memo: orders[i].memo, isTakingAway: orders[i].isTakingAway, UserId: orders[i].UserId
        }).then(item => {
          orders[i].dishes.forEach(dish => {
            return db.DishCombination.create({ OrderId: item.id, DishId: dish.id, perQuantity: dish.quantity, perAmount: dish.price })
          })
        })
      }
      for (let i = 0; i < menu.length; i++) {
        await db.Dish.create({ name: menu[i].name, price: menu[i].price, CategoryId: menu[i].CategoryId })
          .then(dish => {
            menu[i].tags.forEach(tag => {
              return db.DishAttachment.create({ TagId: tag.id, DishId: dish.id })
            })
          })
      }
      await db.User.create(member1)
      await db.User.create(member2)
      await db.User.create(member3)
      await db.Profile.create(profi1)
      await db.Profile.create(profi2)
    })

    context('weekly anaylsis report', () => {

      it('hot products/ hot tags/ hot members', (done) => {
        request(app)
          .get('/api/admin/dashboard?range=weekly')
          .expect(200)
          .end((err, res) => {
            if (err) return done(err)
            // console.log(res.body.data)
            // console.log(time) // 將時間鎖住
            // console.log(nowTime)
            // console.log(res.body.hotProducts)
            // console.log(res.body.hotMembers)
            // console.log(res.body.hotTags)
            expect(typeof (res.body.hotProducts)).to.be.equal('object')
            expect(res.body.hotProducts.length).to.be.equal(5)
            expect(typeof (res.body.hotTags)).to.be.equal('object')
            expect(res.body.hotTags.length).to.be.equal(5)
            expect(typeof (res.body.hotMembers)).to.be.equal('object')
            expect(res.body.hotMembers.length).to.be.equal(2)
            return done()
          })
      })

      xit('hot products growing/ hot tags growing/ hot members growing', (done) => {
        request(app)
          .get('/api/admin/dashboard/lineChart?range=weekly')
          .expect(200)
          .end((err, res) => {
            if (err) return done(err)
            // console.log(res.body)

            return done()
          })
      })
    })

    context('monthly anaylsis report', () => {

      it('hot products/ hot tags/ hot members', (done) => {
        request(app)
          .get('/api/admin/dashboard?range=monthly')
          .expect(200)
          .end((err, res) => {
            if (err) return done(err)
            // console.log(res.body.data)
            // console.log(time) // 將時間鎖住
            // console.log(nowTime)
            // console.log(res.body.hotProducts)
            // console.log(res.body.hotMembers)
            // console.log(res.body.hotTags)
            expect(typeof (res.body.hotProducts)).to.be.equal('object')
            expect(res.body.hotProducts.length).to.be.equal(5)
            expect(typeof (res.body.hotTags)).to.be.equal('object')
            expect(res.body.hotTags.length).to.be.equal(5)
            expect(typeof (res.body.hotMembers)).to.be.equal('object')
            expect(res.body.hotMembers.length).to.be.equal(2)
            return done()
          })
      })
    })


    after(async () => {
      this.ensureAuthenticated.restore()
      this.getUser.restore()
      tk.reset()
      await db.Tag.destroy({ where: {}, truncate: true })
      await db.Dish.destroy({ where: {}, truncate: true })
      await db.User.destroy({ where: {}, force: true, truncate: true })
      await db.Order.destroy({ where: {}, force: true, truncate: true })
      await db.DishCombination.destroy({ where: {}, truncate: true })
      await db.DishAttachment.destroy({ where: {}, truncate: true })
      await db.Profile.destroy({ where: {}, truncate: true })
    })
  })
})