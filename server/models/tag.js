'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    name: DataTypes.STRING
  }, {
      indexes: [
        { unique: true, fields: ['name'] }
      ],
      timestamps: false
    });
  Tag.associate = function (models) {
    Tag.belongsToMany(models.Dish, {
      through: models.DishAttachment,
      foreignKey: 'TagId',
      as: 'hasDishes'
    }),
      Tag.belongsToMany(models.User, {
        through: models.UserPreferred,
        foreignKey: 'TagId',
        as: 'hasUseres'
      })
  };
  return Tag;
};