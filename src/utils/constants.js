const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

module.exports = {
  BACKEND_BASE_URL: process.env.BACKEND_BASE_URL,
  FRONTEND_BASE_URL: process.env.FRONTEND_BASE_URL,

  NODE_ENV: process.env.NODE_ENV,

  PORT: process.env.PORT,

  DB: process.env.DB,
  USER: process.env.USER,
  PASSWORD: process.env.PASSWORD,
  HOST: process.env.HOST,
  DIALECT: process.env.DIALECT,
  DB_POOL: {
    max: 5, // maximum number of connection in pool
    min: 0, // minimum number of connection in pool
    acquire: 30000, // maximum time, in milliseconds, that a connection can be idle before being released
    idle: 10000, // maximum time, in milliseconds, that pool will try to get connection before throwing error
  },

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRESIN: process.env.JWT_EXPIRESIN,

  USER_TYPES: {
    SUPER_ADMIN: 1,
    ADMIN: 2,
    CUSTOMER: 3,
  },

  UNAUTHORIZE_ERROR: "Your session has been expired, Please try again.",
  FORBIDDEN_ERROR: "You are not authorized to perform this action.",
  NOT_REGISTER: "User is not registered!",
  INVALID_CREDENTIALS: "Your email or password is wrong, Please try again.",
  VALIDATION_ERROR: "Validation Error! Please check your inputs",
  DUPLICATE_ERROR: "Record already exists, Please try again.",
  RECORD_CREATED: "Record created successfully.",
  RECORD_UPDATED: "Record updated successfully.",
  RECORD_DELETED: "Record deleted successfully.",
  RECORD_FOUND: "Record fetched successfully.",
  RECORDS_FOUND: "Records fetched successfully.",
  NO_RECORD_FOUND: "No record found.",
  RECORD_NOT_EXIST: "Record does not exist.",
  SERVER_ERROR: "Something bad happened on server!",
  BAD_REQUEST_MESSAGE: "Please pass all the required inputs.",
  NOT_AUTHORIZED: "You are not authorized to perfrom this action.",
};
