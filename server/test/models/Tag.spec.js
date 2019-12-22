process.env.NODE_ENV = 'test'

var chai = require('chai')
var sinon = require('sinon')
chai.use(require('sinon-chai'))

const { expect } = require('chai')

const {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} = require('sequelize-test-helpers')
const db = require('../../models')
const TagModel = require('../../models/tag')

describe('# Tag Model', function () {
  const Tag = TagModel(sequelize, dataTypes)
  const tag = new Tag()

  checkModelName(Tag)('Tag')

  context('properties', () => {
    ['name'].forEach(checkPropertyExists(tag))
  })

  context('check associations', function () {

  })
})