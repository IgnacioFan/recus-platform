'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('DishAttachments',
      Array.from({ length: 50 }).map(
        (item) => ({
          TagId: Math.floor(Math.random() * 19) + 1,
          DishId: Math.floor(Math.random() * 49) + 1
        }))
      , {});

  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.bulkDelete('DishAttachments', null, {});

  }
};
