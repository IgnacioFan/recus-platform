'use strict';
const Op = require('sequelize').Op
const moment = require('moment')

module.exports = (sequelize, DataTypes) => {
  const DishCombination = sequelize.define('DishCombination', {
    perQuantity: DataTypes.INTEGER,
    perAmount: DataTypes.INTEGER,
    //perOption: DataTypes.STRING,
    DishId: DataTypes.INTEGER,
    OrderId: DataTypes.INTEGER
  }, {
      scopes: {
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
        }
      }
      //deletedAt: 'destroyTime',
      //paranoid: true
    });
  DishCombination.associate = function (models) {
    DishCombination.belongsTo(models.Dish)
    DishCombination.belongsTo(models.Order)
  };
  return DishCombination;
};