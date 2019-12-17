'use strict';
const bcrpty = require('bcrypt')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      account: 'root',
      phone: '0900',
      password: bcrpty.hashSync('12345678', 10),
      name: 'root',
      email: 'root@example.com',
      isAdmin: true,
      isValid: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      account: 'user1',
      phone: '0901',
      password: bcrpty.hashSync('12345678', 10),
      name: 'Nacho',
      email: 'user1@example.com',
      isAdmin: false,
      isValid: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      account: 'user2',
      phone: '0902',
      password: bcrpty.hashSync('12345678', 10),
      name: 'yoshi',
      email: 'user2@example.com',
      isAdmin: false,
      isValid: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
