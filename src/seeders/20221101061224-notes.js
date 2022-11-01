"use strict";

/** @type {import('sequelize-cli').Migration} */
/**
 * Adds sample data automatically when `npx sequelize-cli db:seed:all`
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Notes",
      [
        {
          title: "This is first note",
          content: "Hello world",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Notes", null, {});
  },
};
