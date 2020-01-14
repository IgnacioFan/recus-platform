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
              [Op.gte]: moment().hour(0)//new Date().setHours(0, 0, 0)
              , [Op.lte]: moment().hour(23)
            }
          }
        },
        weekly: {
          where: {
            createdAt: {
              [Op.gte]: moment().subtract(7, 'days').hours(0)
              , [Op.lte]: moment().subtract(1, 'days').hours(23)
            }
          }
        },
        monthly: {
          where: {
            createdAt: {
              [Op.gte]: moment().subtract(30, 'days')
              , [Op.lte]: moment().subtract(1, 'days')
            }
          }

        },
      },
      timestamps: true,
      paranoid: true
    });
  Order.associate = function (models) {
    Order.belongsTo(models.User)
    Order.hasMany(models.MemberOrder)
    Order.belongsToMany(models.Dish, {
      through: models.DishCombination,
      foreignKey: 'OrderId',
      as: 'sumOfDishes',
      hooks: true,
      onDelete: 'cascade'
    })
  };
  return Order;
};