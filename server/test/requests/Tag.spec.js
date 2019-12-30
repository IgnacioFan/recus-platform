var chai = require('chai')
var request = require('supertest')
var sinon = require('sinon')
var app = require('../../app')

var helpers = require('../../_helpers');
var should = chai.should();
var expect = chai.expect;
const db = require('../../models')

describe('菜單管理/標籤', () => {
  context('# tags', () => {

    before(async () => {
      this.ensureAuthenticated = sinon.stub(
        helpers, 'ensureAuthenticated'
      ).returns(true)
      this.getUser = sinon.stub(
        helpers, 'getUser'
      ).returns({ isAdmin: true })
      //await db.User.create({})
      //await db.Category.destroy({ where: {}, truncate: true })
      //await db.Dish.destroy({ where: {}, truncate: true })
      await db.Tag.destroy({ where: {}, truncate: true })
      // await db.DishAttachment.destroy({ where: {}, truncate: true })
      //await db.Category.create({ name: 'tee' })
      // await db.Category.create({ name: 'coffee' })
      // await db.Dish.create({ name: 'americana', price: 50, CategoryId: 2 })
      // await db.Dish.create({ name: 'latei', price: 60, CategoryId: 2 })
      //await db.Dish.create({ name: '紅茶', price: 40, CategoryId: 1 })
      await ["濃韻", "熟茶", "日月潭"].forEach(item => {
        db.Tag.create({ name: item })
      })
    })

    describe('get: api/tags', () => {
      it('get all tags', (done) => {
        request(app)
          .get('/api/tags')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err)
            //res.text.should.include('濃韻')
            res.text.should.include('熟茶')
            return done();
          });
      })
    })

    describe('post: api/tags', () => {
      it('add a new tag', (done) => {
        request(app)
          .post('/api/tags')
          .send('name=清心潤喉')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err)
            //res.text.should.include('濃韻')
            res.text.should.include('清心潤喉')
            return done();
          });
      })

      it('add the same name of tag', (done) => {
        request(app)
          .post('/api/tags')
          .send('name=熟茶')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            res.text.should.include('標籤已建立')
            return done();
          });
      })
    })

    describe('put: api/tags/1', () => {
      it('update a new name of tag', (done) => {
        request(app)
          .put('/api/tags/1')
          .send('name=熟茶2.0')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            res.text.should.include('熟茶2.0')
            return done();
          });
      })

      it('update the same name of tag', (done) => {
        request(app)
          .put('/api/tags/2')
          .send('name=熟茶')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err)
            res.text.should.include('標籤名稱相同')
            return done();
          });
      })
    })

    describe('delete: api/tags/3', () => {
      it('delete tag 3', (done) => {
        request(app)
          .delete('/api/tags/3')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err)
            //expect().to.be.null
            res.text.should.include('成功移除日月潭')
            return done();
          });
      })
    })
    after(async () => {
      this.ensureAuthenticated.restore();
      this.getUser.restore();
      //await db.User.destroy({ where: {}, truncate: true })
      await db.Category.destroy({ where: {}, truncate: true })
      await db.Dish.destroy({ where: {}, truncate: true })
      await db.Tag.destroy({ where: {}, truncate: true })
      //await db.DishAttachment.destroy({ where: {}, truncate: true })
    })
  })
})