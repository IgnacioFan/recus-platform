'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      state: {
        type: Sequelize.STRING,
        defaultValue: "pending"
      },
      amount: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      memo: {
        type: Sequelize.STRING,
        defaultValue: 'none'
      },
      isTakingAway: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      tableNum: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      UserId: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
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
    return queryInterface.dropTable('Orders');
  }
};