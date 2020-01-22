process.env.NODE_ENV = 'test'

var chai = require('chai')
var request = require('supertest')
var sinon = require('sinon')
var app = require('../../app')

var helpers = require('../../_helpers');
var should = chai.should();
var expect = chai.expect;
const db = require('../../models')

describe('# Admin::Dish Request', () => {
  context('go to Dish-Management feature', () => {

    before(async () => {
      this.ensureAuthenticated = sinon.stub(
        helpers, 'ensureAuthenticated'
      ).returns(true)
      this.getUser = sinon.stub(
        helpers, 'getUser'
      ).returns({ id: 1, role: 'admin' })

      await db.Category.create({ name: 'new' })
      await db.Category.create({ name: 'coffee' })
      await db.Dish.create({ name: 'mocha', price: 60, CategoryId: 1 })
      await db.Dish.create({ name: 'americana', price: 50, CategoryId: 2 })
      await db.Dish.create({ name: 'latei', price: 60, CategoryId: 2 })
      await db.Tag.create({ name: "濃韻" })
      await db.Tag.create({ name: "中焙" })
      await db.Tag.create({ name: "義式豆" })
      await db.DishAttachment.create({ DishId: 1, TagId: 1 })
      await db.DishAttachment.create({ DishId: 1, TagId: 2 })
    })

    it('should get a certain category with its dishes', (done) => {
      request(app)
        .get('/api/admin/dishes?categoryId=2')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          // res.text.should.include('americana')
          // res.text.should.include('latei')
          expect(res.body).to.have.property('dishes')
          expect(res.body.dishes.length).to.be.equal(2)
          return done();
        });
    })

    it('should add a new dish, including category', (done) => {
      request(app)
        .post('/api/admin/dishes')
        .send({
          name: '紅茶',
          price: 40,
          CategoryId: 1,
          tags: [{ id: 1 }, { id: 2 }]
        })
        .expect(200)
        .end(async (err, res) => {
          if (err) return done(err)
          //console.log(res.body)
          expect(res.body.dish.name).to.be.equal('紅茶')
          expect(res.body.dish.price).to.be.equal(40)
          expect(res.body.msg).to.be.equal('成功新增菜單!')
          //expect(dish.option.sugar).to.have.property('sugar')
          return done()
        })
    })
    // 檢查dish 4 是不是有兩個標籤（中焙、濃韻）
    it('should get a specific dish with its category and its tags', (done) => {
      request(app)
        .get('/api/admin/dishes/4')
        .expect(200)
        .end(async (err, res) => {
          if (err) return done(err)
          console.log(res.body.dish)
          expect(res.body.dish.name).to.be.equal('紅茶')
          expect(res.body.dish.price).to.be.equal(40)
          expect(res.body.dish.Category.name).to.be.equal('new')
          expect(res.body.dish.hasTags[0].name).to.be.equal('中焙')
          expect(res.body.dish.hasTags[1].name).to.be.equal('濃韻')
          return done()
        })
    })

    it('should update specific dish', (done) => {
      request(app)
        .put('/api/admin/dishes/4')
        .send({ name: '阿里山紅茶', price: 60, CategoryId: 1, removeTags: [{ id: 1 }], addTags: [{ id: 3 }] })
        .expect(200)
        .end(async (err, res) => {
          if (err) return done(err)
          expect(res.body.dish.name).to.be.equal('阿里山紅茶')
          expect(res.body.dish.price).to.be.equal(60);
          return done();
        })
    })
    // 再次檢查dish 4 是不是有兩個標籤（中焙、義式豆）
    it('should get a specific dish with its category and its tags', (done) => {
      request(app)
        .get('/api/admin/dishes/4')
        .expect(200)
        .end(async (err, res) => {
          if (err) return done(err)
          //console.log(res.body.dish.hasTags)
          expect(res.body.dish.hasTags[0].name).to.be.equal('中焙')
          expect(res.body.dish.hasTags[1].name).to.be.equal('義式豆')
          return done()
        })
    })

    it('should delete Dish 4', (done) => {
      request(app)
        .delete('/api/admin/dishes/4')
        .expect(200)
        .end(async (err, res) => {
          if (err) return done(err)
          expect(res.body.msg).to.be.equal('已刪除阿里山紅茶！')
          return done()
        })
    })

    after(async () => {

      this.ensureAuthenticated.restore();
      this.getUser.restore();

      await db.Category.destroy({ where: {}, truncate: true })
      await db.Dish.destroy({ where: {}, truncate: true })
      await db.Tag.destroy({ where: {}, truncate: true })
      await db.DishAttachment.destroy({ where: {}, truncate: true })
    })
  })
})

