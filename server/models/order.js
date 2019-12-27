'use strict';
const Op = require('sequelize').Op

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    state: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    memo: DataTypes.STRING,
    isTakingAway: DataTypes.BOOLEAN,
    tableNum: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    //deletedAt: DataTypes.Date
  }, {
      defaultScope: {
        //where: { deleted_at: null }
        //paranoid: false
      },
      scopes: {
        todayOrder: {
          where: {
            createdAt: {
              [Op.gte]: new Date().setHours(0, 0, 0)
              , [Op.lte]: new Date()
            }
          }
        }

      }
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