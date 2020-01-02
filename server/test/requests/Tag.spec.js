process.env.NODE_ENV = 'test'

var request = require('supertest')
var sinon = require('sinon')
var app = require('../../app')

var helper = require('../../_helpers');
var chai = require('chai')
var should = chai.should();
var expect = chai.expect;
const db = require('../../models')

describe('# Admin::Dish Management', () => {
  context('go to Dish-Management feature', () => {

    before(async () => {
      this.ensureAuthenticated = sinon.stub(
        helper, 'ensureAuthenticated'
      ).returns(true);
      this.getUser = sinon.stub(
        helper, 'getUser'
      ).returns({ id: 1, isAdmin: true });
      await db.Tag.destroy({ where: {}, truncate: true })
      // await ["濃韻", "熟茶", "日月潭"].forEach(item => {
      //   db.Tag.create({ name: item })
      // })
    })

    it('should get tags', (done) => {
      request(app)
        .get('/api/tags')
        .end((err, res) => {
          res.status.should.be.eql(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    })


    it('should post a new tag', (done) => {
      request(app)
        .post('/api/tags')
        .send('name=微酸')
        .end((err, res) => {
          res.status.should.be.eql(200);
          res.text.should.include('微酸');
          done();
        });
    })

    it('if post the same name of tag', (done) => {
      request(app)
        .post('/api/tags')
        .send('name=微酸')
        .end(function (err, res) {
          if (err) return done(err);
          //console.log(res.body)
          res.status.should.be.eql(200);
          res.text.should.include('標籤已建立')
          done();
        });
    })

    it('should update a new name of tag', (done) => {
      request(app)
        .put('/api/tags/1')
        .send('name=微酸2.0')
        .end(function (err, res) {
          if (err) return done(err);
          res.status.should.be.eql(200);
          res.text.should.include('微酸2.0')
          done()
        })
    })

    it('if update the same name of tag', (done) => {
      request(app)
        .put('/api/tags/1')
        .send('name=微酸2.0')
        .end(function (err, res) {
          if (err) return done(err)
          //console.log(res.body)
          res.status.should.be.eql(200)
          res.text.should.include('標籤名稱相同')
          done()
        })
    })

    it('should delete tag 1', (done) => {
      request(app)
        .delete('/api/tags/1')
        .end(function (err, res) {
          if (err) return done(err)
          //console.log(res.body)
          res.status.should.be.eql(200)
          res.body.should.be.a('object')
          res.text.should.include('成功移除微酸2.0')
          done();
        });
    })

    after(async () => {
      this.ensureAuthenticated.restore();
      this.getUser.restore();
      //await db.User.destroy({ where: {}, truncate: true })
      //await db.User.destroy({ where: {}, truncate: true })
      await db.Tag.destroy({ where: {}, truncate: true })
    })
  })
})