var chai = require('chai')
var request = require('supertest')
var sinon = require('sinon')
var app = require('../../app')

var helpers = require('../../_helpers');
var should = chai.should();
var expect = chai.expect;
const db = require('../../models')


describe('菜單管理/菜單', () => {
  context('# dishes', () => {

    before(async () => {
      this.ensureAuthenticated = sinon.stub(
        helpers, 'ensureAuthenticated'
      ).returns(true)
      this.getUser = sinon.stub(
        helpers, 'getUser'
      ).returns({ isAdmin: true })
      //await db.User.create({})
      await db.Category.destroy({ where: {}, truncate: true })
      await db.Dish.destroy({ where: {}, truncate: true })
      await db.Tag.destroy({ where: {}, truncate: true })
      await db.DishAttachment.destroy({ where: {}, truncate: true })
      await db.Category.create({ name: 'new' })
      await db.Category.create({ name: 'coffee' })
      await db.Dish.create({ name: 'americana', price: 50, CategoryId: 2 })
      await db.Dish.create({ name: 'latei', price: 60, CategoryId: 2 })
      await db.Dish.create({ name: 'mocha', price: 60, CategoryId: 1 })
      await ["濃韻", "熟茶", "日月潭"].forEach(item => {
        db.Tag.create({ name: item })
      })
    })

    describe('get: api/dishes', () => {

      it('get dishes dividing by different categories', (done) => {
        request(app)
          .get('/api/dishes?categoryId=2')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            res.text.should.include('americana')
            res.text.should.include('latei')
            return done();
          });
      })

    })

    describe('post: api/dishes', () => {

      it('add a new dish, including category', (done) => {
        request(app)
          .post('/api/dishes')
          .send({ name: '紅茶', price: 40, CategoryId: 1, tags: [1, 2, 3] })
          .set('Accept', 'application/json')
          .expect('Content-type', /json/)
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err)
            //console.log(res.body)
            db.Dish.findByPk(4).then(dish => {
              dish.name.should.equal('紅茶');
              return done();
            })
          })
      })

      it('there are 3 tag in Dish 4', (done) => {
        db.Dish.findByPk(4, { include: [{ model: db.Tag, as: 'hasTags' }] }).then(dish => {
          //console.log(dish)
          expect(dish.name).to.be.equal('紅茶')
          expect(dish.hasTags.length).to.be.equal(3)
          done()
        })
      })

    })

    describe('put: api/dishes/:id', () => {

      it('update dish name', (done) => {
        request(app)
          .put('/api/dishes/4')
          .send({ name: '阿里山紅茶', price: 60, CategoryId: 1, removeTags: [1, 2] })
          .set('Accept', 'application/json')
          .expect('Content-type', /json/)
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err)
            //console.log(res.body)
            db.Dish.findByPk(4).then(dish => {
              dish.name.should.not.equal('紅茶');
              //dish.hasTags.length.should.equal(1);
              return done();
            })
          })
      })

      it('there is 1 tag in Dish 4', (done) => {
        db.Dish.findByPk(4, { include: [{ model: db.Tag, as: 'hasTags' }] }).then(dish => {
          //console.log(dish)
          expect(dish.price).to.be.equal(60)
          expect(dish.hasTags.length).to.be.equal(1)
          done()
        })
      })

    })

    describe('delete: api/dishes/:id', () => {

      it('Dish 4 has deleteted', (done) => {
        request(app)
          .delete('/api/dishes/4')
          .set('Accept', 'application/json')
          .expect('Content-type', /json/)
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            db.Dish.findByPk(4).then(dish => {
              expect(dish).to.be.null
              done()
            })
          });
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
      //await db.User.destroy({ where: {}, truncate: true })
      await db.Category.destroy({ where: {}, truncate: true })
      await db.Dish.destroy({ where: {}, truncate: true })
      await db.Tag.destroy({ where: {}, truncate: true })
      await db.DishAttachment.destroy({ where: {}, truncate: true })
    })
  })
})