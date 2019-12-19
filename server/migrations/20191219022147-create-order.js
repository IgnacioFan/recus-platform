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
        allowNull: false,
        default: "pending"
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0
      },
      memo: {
        type: Sequelize.STRING,
        default: 'none'
      },
      isTakingAway: {
        type: Sequelize.BOOLEAN
      },
      tableNum: {
        type: Sequelize.INTEGER,
        default: 0
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        reference: {
          model: 'Users',
          key: 'id'
        }
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