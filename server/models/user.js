'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    account: DataTypes.STRING,
    phone: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    image: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    isValid: DataTypes.BOOLEAN
  }, {});
  User.associate = function (models) {
    User.hasMany(models.Order)
  };
  return User;
};