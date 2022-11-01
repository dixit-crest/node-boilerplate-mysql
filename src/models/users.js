"use strict";

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    "Users",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: { type: DataTypes.STRING, unique: true },
      password: DataTypes.STRING,
      role: DataTypes.INTEGER(3),
      token: DataTypes.STRING,
      passwordToken: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
    },
    {}
  );
  Users.associate = function (models) {
    models.Users.hasMany(models.Notes, {
      foreignKey: {
        name: "user",
      },
    });
  };
  return Users;
};
