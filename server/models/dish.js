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
      indexes: [
        { unique: true, fields: ['name'] }
      ],
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