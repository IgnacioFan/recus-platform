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
moment.locale('zh_tw')
var tk = require('timekeeper')
const nowTime = new Date()

const time1 = moment(nowTime, "YYYY-M-D H:m").subtract(1, 'weeks').day(1).toDate()
const time2 = moment(nowTime, "YYYY-M-D H:m").subtract(1, 'weeks').day(2).toDate()
const time3 = moment(nowTime, "YYYY-M-D H:m").subtract(1, 'weeks').day(3).toDate()

const time4 = moment(nowTime, "YYYY-M-D H:m").subtract(5, 'weeks').day(1).toDate()
const time5 = moment(nowTime, "YYYY-M-D H:m").subtract(6, 'weeks').day(1).toDate()
const time6 = moment(nowTime, "YYYY-M-D H:m").subtract(7, 'weeks').day(1).toDate()

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
    quantity: 3, amount: 240, memo: 'this is second order', isTakingAway: true, UserId: 0,
    dishes: [{ id: 1, quantity: 1, price: 60 }, { id: 2, quantity: 1, price: 80 }, { id: 4, quantity: 1, price: 100 }]
  },
  {
    quantity: 3, amount: 300, memo: 'this is second order', isTakingAway: true, UserId: 2,
    dishes: [{ id: 7, quantity: 2, price: 100 }, { id: 7, quantity: 1, price: 100 }]
  },
  {
    quantity: 3, amount: 300, memo: 'this is third order', isTakingAway: true, UserId: 0,
    dishes: [{ id: 6, quantity: 2, price: 100 }, { id: 8, quantity: 1, price: 100 }]
  },
  {
    quantity: 3, amount: 220, memo: 'this is fourth order', isTakingAway: true, UserId: 0,
    dishes: [{ id: 1, quantity: 2, price: 60 }, { id: 5, quantity: 1, price: 100 }]
  },
  {
    quantity: 4, amount: 380, memo: 'this is fifth order', isTakingAway: true, UserId: 3,
    dishes: [{ id: 6, quantity: 3, price: 100 }, { id: 2, quantity: 1, price: 80 }]
  },
  {
    quantity: 2, amount: 200, memo: 'this is sixth order', isTakingAway: true, UserId: 2,
    dishes: [{ id: 7, quantity: 1, price: 100 }, { id: 5, quantity: 1, price: 100 }]
  },
  {
    quantity: 2, amount: 160, memo: 'this is seventh order', isTakingAway: true, UserId: 2,
    dishes: [{ id: 1, quantity: 1, price: 60 }, { id: 7, quantity: 1, price: 100 }]
  },
  {
    quantity: 2, amount: 160, memo: 'this is eighth order', isTakingAway: true, UserId: 2,
    dishes: [{ id: 1, quantity: 1, price: 60 }, { id: 7, quantity: 1, price: 100 }]
  }

]
const member1 = { id: 1, account: 'user1', phone: '0901', password: '12345', role: 'admin' }
const member2 = { id: 2, account: 'user2', phone: '0902', password: '12345', role: 'member' }
const member3 = { id: 3, account: 'user3', phone: '0903', password: '12345', role: 'member' }
const profi1 = { name: 'nacho', email: 'nacho@example.com', UserId: 2 }
const profi2 = { name: 'kirwen', email: 'kirwen@example.com', UserId: 3 }
const userPreferred = [{ TagId: 1, UserId: 2 }, { TagId: 8, UserId: 3 }, { TagId: 3, UserId: 2 }
  , { TagId: 1, UserId: 3 }, { TagId: 4, UserId: 2 }, { TagId: 10, UserId: 2 }]

describe('# Admin::Dashboard Request', () => {
  context('go to Dashboard feature(weekly)', () => {

    before(async () => {
      this.ensureAuthenticated = sinon.stub(
        helpers, 'ensureAuthenticated'
      ).returns(true)
      this.getUser = sinon.stub(
        helpers, 'getUser'
      ).returns({ id: 1, role: 'admin' })

      tk.freeze(nowTime)
      for (let i = 0; i < tags.length; i++) {
        await db.Tag.create({ name: tags[i] })
      }
      for (let i = 0; i < orders.length; i++) {
        let curretnTime
        if (i < 2) {
          curretnTime = time1
        } else if (i >= 2 && i < 4) {
          curretnTime = time2
        } else {
          curretnTime = time3
        }
        await db.Order.create({
          quantity: orders[i].quantity, amount: orders[i].amount, createdAt: curretnTime, state: 'paid',
          memo: orders[i].memo, isTakingAway: orders[i].isTakingAway, UserId: orders[i].UserId
        })
        for (let j = 0; j < orders[i].dishes.length; j++) {
          await db.DishCombination.create({
            OrderId: i + 1, DishId: orders[i].dishes[j].id,
            perQuantity: orders[i].dishes[j].quantity, perAmount: orders[i].dishes[j].price,
            createdAt: curretnTime
          })
        }
      }
      for (let i = 0; i < menu.length; i++) {
        dish = await db.Dish.create({ name: menu[i].name, price: menu[i].price, CategoryId: menu[i].CategoryId })
        for (let j = 0; j < menu[i].tags.length; j++) {
          await db.DishAttachment.create({ TagId: menu[i].tags[j].id, DishId: i + 1 })
        }
      }
      for (let i = 0; i < userPreferred.length; i++) {
        let currentTime
        if (i < userPreferred.length / 2) currentTime = time1
        else currentTime = time3
        await db.UserPreferred.create({
          TagId: userPreferred[i].TagId,
          UserId: userPreferred[i].UserId,
          createdAt: currentTime
        })
      }
      await db.User.create(member1)
      await db.User.create(member2)
      await db.User.create(member3)
      await db.Profile.create(profi1)
      await db.Profile.create(profi2)
    })

    context('get basic info report', () => {
      it("current member numbers/ today's order numbers/ current order numbers", (done) => {
        request(app)
          .get('/api/admin/dashboard')
          .expect(200)
          .end((err, res) => {
            if (err) return done(err)
            // console.log(res.body)
            // 分析有收藏標籤的會員
            expect(res.body.memWithTags).to.be.equal(2)
            expect(res.body.totalMembers).to.be.equal(2)
            // 分析有會員與無會員訂單的比例
            expect(res.body.memWithoutOrder).to.be.equal(3)
            expect(res.body.totalOrder).to.be.equal(8)
            return done()
          })
      })
    })

    context('weekly anaylsis report', () => {

      it('hot products/ hot tags/ hot members', (done) => {
        request(app)
          .get('/api/admin/dashboard/pieChart?range=weekly')
          .expect(200)
          .end((err, res) => {
            if (err) return done(err)
            // console.log(nowTime) // 將時間鎖住
            // console.log(time1)
            // console.log(time2)
            // console.log(time3)
            // console.log(res.body)
            expect(res.body.hotProducts[0]).to.eql({ id: 1, name: '黑框美式', count: 4 })
            expect(res.body.hotProducts.length).to.be.equal(5)
            expect(res.body.otherProducts).to.be.equal(2)
            expect(res.body.hotMembers[0]).to.eql({ id: 2, name: 'nacho', count: 4 })
            expect(res.body.hotMembers.length).to.be.equal(2)
            expect(res.body.otherMembers).to.be.equal(0)
            expect(res.body.hotTags[0]).to.eql({ id: 9, name: '手沖', count: 10 })
            expect(res.body.hotTags.length).to.be.equal(5)
            expect(res.body.otherTags).to.be.equal(6)
            return done()
          })
      })

      it('products growing', (done) => {
        request(app)
          .get('/api/admin/dashboard/lineChart?type=product&range=weekly&id=1&id=7')
          .expect(200)
          .end((err, res) => {
            if (err) return done(err)
            // console.log(res.body)
            expect(res.body.days.length).to.be.equal(3)
            expect(Object.keys(res.body.pChart)).to.eql(['黑框美式', '皇后花園'])
            return done()
          })
      })

      it('times of member visiting growing', (done) => {
        request(app)
          .get('/api/admin/dashboard/lineChart?type=user&range=weekly&id=2&id=3')
          .expect(200)
          .end((err, res) => {
            if (err) return done(err)
            // console.log(res.body)
            expect(res.body.days.length).to.be.equal(2)
            expect(Object.keys(res.body.uChart)).to.eql(['nacho', 'kirwen'])
            return done()
          })
      })

      it('tags of member preferred growing', (done) => {
        request(app)
          .get('/api/admin/dashboard/lineChart?type=tag&range=weekly&id=1&id=10')
          .expect(200)
          .end((err, res) => {
            if (err) return done(err)
            // console.log(res.body)
            expect(res.body.days.length).to.be.equal(2)
            expect(Object.keys(res.body.tChart)).to.eql(['淺焙', '義式機'])
            return done()
          })
      })
    })

    after(async () => {
      this.ensureAuthenticated.restore()
      this.getUser.restore()
      //tk.reset()
      await db.Tag.destroy({ where: {}, truncate: true })
      await db.Dish.destroy({ where: {}, truncate: true })
      await db.User.destroy({ where: {}, force: true, truncate: true })
      await db.UserPreferred.destroy({ where: {}, truncate: true })
      await db.Order.destroy({ where: {}, force: true, truncate: true })
      await db.DishCombination.destroy({ where: {}, truncate: true })
      await db.DishAttachment.destroy({ where: {}, truncate: true })
      await db.Profile.destroy({ where: {}, truncate: true })
    })
  })

  context('go to Dashboard feature(monthly)', () => {
    before(async () => {
      this.ensureAuthenticated = sinon.stub(
        helpers, 'ensureAuthenticated'
      ).returns(true)
      this.getUser = sinon.stub(
        helpers, 'getUser'
      ).returns({ id: 1, role: 'admin' })

      tk.freeze(nowTime)
      for (let i = 0; i < tags.length; i++) {
        await db.Tag.create({ name: tags[i] })
      }
      for (let i = 0; i < orders.length; i++) {
        let curretnTime
        if (i < 2) {
          curretnTime = time4
        } else if (i >= 2 && i < 4) {
          curretnTime = time5
        } else {
          curretnTime = time6
        }
        await db.Order.create({
          quantity: orders[i].quantity, amount: orders[i].amount, createdAt: curretnTime,
          memo: orders[i].memo, isTakingAway: orders[i].isTakingAway, UserId: orders[i].UserId
        })
        for (let j = 0; j < orders[i].dishes.length; j++) {
          await db.DishCombination.create({
            OrderId: i + 1, DishId: orders[i].dishes[j].id,
            perQuantity: orders[i].dishes[j].quantity, perAmount: orders[i].dishes[j].price,
            createdAt: curretnTime
          })
        }
      }
      for (let i = 0; i < menu.length; i++) {
        dish = await db.Dish.create({ name: menu[i].name, price: menu[i].price, CategoryId: menu[i].CategoryId })
        for (let j = 0; j < menu[i].tags.length; j++) {
          await db.DishAttachment.create({ TagId: menu[i].tags[j].id, DishId: i + 1 })
        }
      }
      for (let i = 0; i < userPreferred.length; i++) {
        let currentTime
        if (i < userPreferred.length / 2) currentTime = time4
        else currentTime = time6
        await db.UserPreferred.create({
          TagId: userPreferred[i].TagId,
          UserId: userPreferred[i].UserId,
          createdAt: currentTime
        })
      }
      await db.User.create(member1)
      await db.User.create(member2)
      await db.User.create(member3)
      await db.Profile.create(profi1)
      await db.Profile.create(profi2)
    })

    context('monthly anaylsis report', () => {

      it('hot products/ hot tags/ hot members', (done) => {
        request(app)
          .get('/api/admin/dashboard/pieChart?range=monthly')
          .expect(200)
          .end((err, res) => {
            if (err) return done(err)
            // console.log(res.body)

            // console.log(res.body.data2)
            // console.log(res.body.hotProducts[0])
            // console.log(res.body.hotMembers[0])
            // console.log(res.body.hotTags[0])
            expect(res.body.hotProducts[0]).to.eql({ id: 1, name: '黑框美式', count: 4 })
            expect(res.body.hotProducts.length).to.be.equal(5)
            expect(res.body.hotMembers[0]).to.eql({ id: 2, name: 'nacho', count: 4 })
            expect(res.body.hotMembers.length).to.be.equal(2)
            expect(res.body.hotTags[0]).to.eql({ id: 9, name: '手沖', count: 10 })
            expect(res.body.hotTags.length).to.be.equal(5)
            return done()
          })
      })

      it('products growing', (done) => {
        request(app)
          .get('/api/admin/dashboard/lineChart?type=product&range=monthly&id=1&id=7')
          .expect(200)
          .end((err, res) => {
            if (err) return done(err)
            // console.log(nowTime) // 將時間鎖住
            // console.log(time1)
            // console.log(time2)
            // console.log(time3)
            // console.log(res.body)
            // console.log(res.body.pChart)
            // console.log(res.body.products)
            expect(res.body.days.length).to.be.equal(3)
            expect(Object.keys(res.body.pChart)).to.eql(['黑框美式', '皇后花園'])
            return done()
          })
      })

      it('times of member visiting growing', (done) => {
        request(app)
          .get('/api/admin/dashboard/lineChart?type=user&range=monthly&id=1&id=2')
          .expect(200)
          .end((err, res) => {
            if (err) return done(err)
            // console.log(res.body)
            // console.log(res.body.uChart)
            // console.log(res.body.users)
            expect(res.body.days.length).to.be.equal(2)
            expect(Object.keys(res.body.uChart)).to.eql(['nacho'])
            return done()
          })
      })

      it('tags of member preferred growing', (done) => {
        request(app)
          .get('/api/admin/dashboard/lineChart?type=tag&range=monthly&id=1&id=10')
          .expect(200)
          .end((err, res) => {
            if (err) return done(err)
            // console.log(res.body)
            expect(res.body.days.length).to.be.equal(2)
            expect(Object.keys(res.body.tChart)).to.eql(['淺焙', '義式機'])
            return done()
          })
      })
    })

    after(async () => {
      this.ensureAuthenticated.restore()
      this.getUser.restore()
      //tk.reset()
      await db.Tag.destroy({ where: {}, truncate: true })
      await db.Dish.destroy({ where: {}, truncate: true })
      await db.User.destroy({ where: {}, force: true, truncate: true })
      await db.UserPreferred.destroy({ where: {}, truncate: true })
      await db.Order.destroy({ where: {}, force: true, truncate: true })
      await db.DishCombination.destroy({ where: {}, truncate: true })
      await db.DishAttachment.destroy({ where: {}, truncate: true })
      await db.Profile.destroy({ where: {}, truncate: true })
    })
  })
})