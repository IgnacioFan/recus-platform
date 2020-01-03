'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    account: DataTypes.STRING,
    phone: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    isValid: DataTypes.BOOLEAN
  }, {
      scopes: {
        'excludedAdmin': {
          where: { 'isAdmin': false }
        }
      },
      deletedAt: 'destroyTime',
      paranoid: true
    });
  User.associate = function (models) {
    User.hasMany(models.Order),
      User.belongsToMany(models.Tag, {
        through: models.UserPreferred,
        foreignKey: 'UserId',
        as: 'preferredTags',
        // hooks: true,
        // onDelete: 'cascade'
      })
  };
  return User;
};