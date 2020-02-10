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
      perQuantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      perAmount: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      DishId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      OrderId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      // perOption: {
      //   type: Sequelize.JSON,
      //   defaultValue: 'none'
      // },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('DishCombinations');
  }
};