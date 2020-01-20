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