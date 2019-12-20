'use strict';
module.exports = (sequelize, DataTypes) => {
  const Dish = sequelize.define('Dish', {
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    option: DataTypes.JSON,
    image: DataTypes.STRING,
    description: DataTypes.TEXT,
    CategoryId: DataTypes.INTEGER
  }, {
      timestamps: false
    });
  Dish.associate = function (models) {
    Dish.belongsTo(models.Category)
    Dish.belongsToMany(models.Order, {
      through: models.DishCombination,
      foreignKey: 'DishId',
      as: 'sumOfOrders'
    })
  };
  return Dish;
};