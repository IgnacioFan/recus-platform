'use strict';
const bcrpty = require('bcryptjs')
const moment = require('moment')
const faker = require('faker/locale/zh_TW')
const today = moment().toDate()
const lastMonth = moment().subtract(1, 'months').toDate()

function createUser() {
  let users = []
  for (let i = 0; i < 32; i++) {
    let seedUser = {
      id: i + 1,
      account: i === 0 ? 'root' : `user${i}`,
      phone: i < 2 ? `090${i}` : "09" + Math.random().toString().slice(-8),
      password: bcrpty.hashSync('12345678', 10),
      role: i < 2 ? 'admin' : 'member',
      isValid: true,
      createdAt: faker.date.between(lastMonth, today),
      updatedAt: new Date()
    }
    users.push(seedUser)
  }
  return users
}

function createProfile() {
  let profiles = []
  for (let i = 0; i < 32; i++) {
    let seedProfile = {
      id: i+1,
      name: faker.fake("{{name.firstName}}{{name.lastName}}"),
      email: i === 0 ? 'root@example.com' : `user${i}@example.com`,
      avatar: faker.image.avatar(),
      UserId: i + 1
    }
    profiles.push(seedProfile)
  }
  return profiles
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', createUser(), {})
    await queryInterface.bulkInsert('Profiles', createProfile(), {})
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Users', null, { truncate: true });
    return queryInterface.bulkDelete('Profiles', null, { truncate: true });
  }
};