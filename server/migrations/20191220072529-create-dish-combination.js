'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('DishCombinations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      quantity: {
        type: Sequelize.INTEGER,
        default: 0
      },
      DishId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        reference: {
          model: 'Dishes',
          key: 'id'
        }
      },
      OrderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        reference: {
          model: 'Orders',
          key: 'id'
        }
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('DishCombinations');
  }
};