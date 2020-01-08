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
      await db.Category.destroy({ where: {}, truncate: true })
      await db.Dish.destroy({ where: {}, truncate: true })
      await db.Tag.destroy({ where: {}, truncate: true })
      await db.DishAttachment.destroy({ where: {}, truncate: true })
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
      // await ["濃韻", "中焙", "義式豆"].forEach(item => {
      //   db.Tag.create({ name: item })
      // })
    })

    it('should get a certain category with its dishes', (done) => {
      request(app)
        .get('/api/admin/dishes?categoryId=2')
        .set('Accept', 'application/json')
        .end(function (err, res) {
          if (err) return done(err);
          res.status.should.be.eql(200)
          res.text.should.include('americana')
          res.text.should.include('latei')
          expect(res.body).to.have.property('dishes')
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
          tags: [{ id: 1 }, { id: 2 }],
          //option: { sugar: ["no", "30%", "half", "70%", "full"] }
        })
        .expect(200)
        .end(async (err, res) => {
          if (err) return done(err)
          expect(res.body.dish.name).to.be.equal('紅茶')
          expect(res.body.dish.price).to.be.equal(40)
          expect(res.body.msg).to.be.equal('successfully add a new dish')
          //expect(dish.option.sugar).to.have.property('sugar')
          return done()
        })
    })

    it('should get a specific dish with its category and its tags', (done) => {
      request(app)
        .get('/api/admin/dishes/4')
        .expect(200)
        .end(async (err, res) => {
          if (err) return done(err)
          console.log(res.body.dish.hasTags)
          //console.log(res.body.hasTags[1].name)
          expect(res.body.dish.name).to.be.equal('紅茶')
          expect(res.body.dish.price).to.be.equal(40)
          expect(res.body.dish.Category.name).to.be.equal('new')

          expect(res.body.dish.hasTags[0].name).to.be.equal('中焙')
          expect(res.body.dish.hasTags[1].name).to.be.equal('濃韻')
          return done()
        })
    })

    it('should not post a new dish', (done) => {
      request(app)
        .post('/api/admin/dishes')
        .expect(200)
        .expect({ status: 'error', msg: 'dish name and price cannot be blank' }, done)
    })


    it('should update specific dish', (done) => {
      request(app)
        .put('/api/admin/dishes/4')
        .send({ name: '阿里山紅茶', price: 60, CategoryId: 1, removeTags: [1] })
        .expect(200)
        .end(async (err, res) => {
          if (err) return done(err)
          expect(res.body.dish.name).to.be.not.equal('紅茶');
          expect(res.body.dish.name).to.be.equal('阿里山紅茶')
          db.DishAttachment.findAll({ where: { DishId: 4 } }).then(tags => {
            expect(tags.length).to.be.equal(1)
          })
          return done();

        })
    })

    it('should delete Dish 4', (done) => {
      request(app)
        .delete('/api/admin/dishes/4')
        .expect(200)
        .end(async (err, res) => {
          if (err) return done(err)
          expect(res.text).to.be.include('成功刪除阿里山紅茶！')
          return done()

        })
    })

    it('there is no tags with DishId 4', (done) => {
      db.DishAttachment.findAll({ where: { DishId: 4 } }).then(tags => {
        expect(tags.length).to.be.equal(0)
        done()
      })
    })

    after(async () => {

      this.ensureAuthenticated.restore();
      this.getUser.restore();
      await db.User.destroy({ where: {}, truncate: true })
      await db.Category.destroy({ where: {}, truncate: true })
      await db.Dish.destroy({ where: {}, truncate: true })
      await db.Tag.destroy({ where: {}, truncate: true })
      await db.DishAttachment.destroy({ where: {}, truncate: true })
    })
  })
})

