'use strict';
const Op = require('sequelize').Op

module.exports = (sequelize, DataTypes) => {
  const Dish = sequelize.define('Dish', {
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    //option: DataTypes.JSON,
    image: DataTypes.STRING,
    description: DataTypes.TEXT,
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
      as: 'hasTags',
      // hooks: true,
      // onDelete: 'CASCADE'
    })
    Dish.belongsToMany(models.Order, {
      through: models.DishCombination,
      foreignKey: 'DishId',
      as: 'sumOfOrders'
    })
  };
  return Dish;
};