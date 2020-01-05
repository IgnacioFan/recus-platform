'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserPreferred = sequelize.define('UserPreferred', {
    TagId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {});
  UserPreferred.associate = function(models) {
    // associations can be defined here
  };
  return UserPreferred;
};