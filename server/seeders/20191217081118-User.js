'use strict';
const bcrpty = require('bcryptjs')
const faker = require('faker')


module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.bulkInsert('Users', [{
      account: 'root1',
      phone: '0900',
      password: bcrpty.hashSync('12345678', 10),
      role: 'admin',
      isValid: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      account: 'root2',
      phone: '0901',
      password: bcrpty.hashSync('12345678', 10),
      role: 'admin',
      isValid: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      account: 'user2',
      phone: '0902',
      password: bcrpty.hashSync('12345678', 10),
      role: 'member',
      isValid: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    return queryInterface.bulkInsert('Users',
      Array.from({ length: 50 }).map(
        (item) => ({
          account: faker.finance.account(),
          phone: faker.phone.phoneNumberFormat(),
          password: bcrpty.hashSync('12345678', 10),
          role: 'member',
          isValid: true,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      ), {})

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};