'use strict';
const Op = require('sequelize').Op
const moment = require('moment')

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    state: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    memo: DataTypes.STRING,
    isTakingAway: DataTypes.BOOLEAN,
    tableNum: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {
      defaultScope: {
        //where: { deleted_at: null }
        //paranoid: false
      },
      scopes: {
        orderWithMember: {
          where: {
            UserId: { [Op.gt]: 0 }
          }
        },
        todayOrder: {
          where: {
            createdAt: {
              [Op.gte]: moment().startOf('day')//new Date().setHours(0, 0, 0)
              , [Op.lte]: moment().endOf('day')
            }
          }
        },
        weekly: {
          where: {
            createdAt: {
              [Op.gte]: moment().subtract(1, 'weeks').startOf('week')
              , [Op.lte]: moment().subtract(1, 'weeks').endOf('week')
            }
          }
        },
        monthly: {
          where: {
            createdAt: {
              [Op.gte]: moment().subtract(1, 'months').startOf('month')
              , [Op.lte]: moment().subtract(1, 'months').endOf('month')
            }
          }

        },
      },
      timestamps: true,
      paranoid: true
    });
  Order.associate = function (models) {
    Order.belongsTo(models.User)
    Order.belongsToMany(models.Dish, {
      through: models.DishCombination,
      foreignKey: 'OrderId',
      as: 'sumOfDishes'
    })
  };
  return Order;
};