'use strict';
module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define('Profile', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    avatar: DataTypes.STRING,
    UserId: DataTypes.INTEGER
  }, {
      timestamps: false
    });
  Profile.associate = function (models) {
    Profile.belongsTo(models.User)
  };
  return Profile;
};