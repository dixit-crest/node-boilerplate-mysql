"use strict";

module.exports = (sequelize, DataTypes) => {
  const Notes = sequelize.define(
    "Notes",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      title: DataTypes.STRING,
      content: DataTypes.TEXT,
      user: DataTypes.INTEGER,
    },
    {}
  );
  Notes.associate = function (models) {};
  return Notes;
};
