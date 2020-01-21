'use strict';
const Op = require('sequelize').Op

module.exports = (sequelize, DataTypes) => {
  const Dish = sequelize.define('Dish', {
    name: DataTypes.STRING,
    price: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    image: DataTypes.STRING,
    description: {
      type: DataTypes.TEXT,
      defaultValue: 'none'
    },
    CategoryId: DataTypes.INTEGER
  }, {
      indexes: [
        { unique: true, fields: ['name'] }
      ],
      scopes: {
        priceRange(low, high) {
          return {
            where: {
              price: {
                [Op.lte]: high,
                [Op.gte]: low
              }
            }
          }
        }
      },
      timestamps: false
    });
  Dish.associate = function (models) {
    Dish.belongsTo(models.Category)
    Dish.belongsToMany(models.Tag, {
      through: models.DishAttachment,
      foreignKey: 'DishId',
      as: 'hasTags'
    })
    Dish.belongsToMany(models.Order, {
      through: models.DishCombination,
      foreignKey: 'DishId',
      as: 'sumOfOrders'
    })
  };
  return Dish;
};