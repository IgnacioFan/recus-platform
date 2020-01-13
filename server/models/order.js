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
        todayOrder: {
          where: {
            createdAt: {
              [Op.gte]: moment().hour(0)//new Date().setHours(0, 0, 0)
              , [Op.lte]: moment().hour(23)
            }
          }
        }
      },
      timestamps: true,
      paranoid: true
    });
  Order.associate = function (models) {
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