"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(path.resolve(__dirname, "../db-config/config.json"))[
  env
];
const db = {};
const {
  DB,
  USER,
  PASSWORD,
  HOST,
  DIALECT,
  DB_POOL,
} = require("../utils/constants");
let sequelize = new Sequelize(DB, USER, PASSWORD, {
  host: HOST,
  dialect: DIALECT,
  operatorsAliases: 0,
  pool: DB_POOL, // Optional - Used for Sequelize connection pool configuration
  define: {
    // freezeTableName: true, // Enforcing the table name to be equal to the model name
  },
  logging: false,
  // logging: (msg) => console.log(msg),
});
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
