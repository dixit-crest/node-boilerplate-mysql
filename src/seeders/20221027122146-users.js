"use strict";
const bcryptjs = require("bcryptjs");
const { USER_TYPES } = require("../utils/constants");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          firstName: "John",
          lastName: "Doe",
          email: "john@doe.com",
          password: bcryptjs.hashSync("john@123", 8),
          createdAt: new Date(),
          updatedAt: new Date(),
          role: USER_TYPES.CUSTOMER,
          token: null,
          passwordToken: null,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
