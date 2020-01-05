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
      await ["濃韻", "熟茶", "日月潭"].forEach(item => {
        db.Tag.create({ name: item })
      })
    })

    it('should get a certain category with its dishes', (done) => {
      request(app)
        .get('/api/dishes?categoryId=2')
        .set('Accept', 'application/json')
        .end(function (err, res) {
          if (err) return done(err);
          res.status.should.be.eql(200)
          res.text.should.include('americana')
          res.text.should.include('latei')
          return done();
        });
    })

    it('should post a new dish, including category', (done) => {
      request(app)
        .post('/api/dishes')
        .send({
          name: '紅茶',
          price: 40,
          CategoryId: 1,
          tags: [1, 2, 3],
          //option: { sugar: ["no", "30%", "half", "70%", "full"] }
        })
        .expect(200)
        .end(async (err, res) => {
          if (err) return done(err)
          //console.log(res.body)
          expect(res.body.dish.name).to.be.equal('紅茶')
          expect(res.body.dish.price).to.be.equal(40)
          expect(res.body.msg).to.be.equal('successfully add a new dish')
          //expect(dish.option.sugar).to.have.property('sugar')
          return done()
        })
    })

    it('should get a specific dish with its category', (done) => {
      request(app)
        .get('/api/dishes/1')
        .expect(200)
        .end(async (err, res) => {
          if (err) return done(err)
          //console.log(res.body)
          expect(res.body.dish.name).to.be.equal('mocha')
          expect(res.body.dish.price).to.be.equal(60)
          expect(res.body.dish.Category.name).to.be.equal('new')
          //expect(dish.option.sugar).to.have.property('sugar')
          return done()
        })
    })

    it('should not post a new dish', (done) => {
      request(app)
        .post('/api/dishes')
        .expect(200)
        .expect({ status: 'error', msg: 'dish name and price cannot be blank' }, done)
    })


    it('should update specific dish', (done) => {
      request(app)
        .put('/api/dishes/4')
        .send({ name: '阿里山紅茶', price: 60, CategoryId: 1, removeTags: [] })
        .expect(200)
        .end(async (err, res) => {
          if (err) return done(err)
          expect(res.body.dish.name).to.be.not.equal('紅茶');
          expect(res.body.dish.name).to.be.equal('阿里山紅茶')
          return done();

        })
    })

    it('should delete Dish 4', (done) => {
      request(app)
        .delete('/api/dishes/4')
        .expect(200)
        .end(async (err, res) => {
          if (err) return done(err)
          const dish = await db.Dish.findByPk(4)
          expect(dish).to.be.null
          return done()

        })
    })

    it('there is no tags with DishId 4', (done) => {
      db.DishAttachment.findAll({ where: { DishId: 4 } }).then(tags => {
        expect(tags.length).to.be.equal(0)
        done()
      })
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
