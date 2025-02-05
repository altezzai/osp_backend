"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "books",
      [
        {
          title: "Sample Ruby Book",
          description: "This is a sample ruby book description",
          url: "https://example.com/ruby-book",
          type: "ruby",
          category: "Programming",
          sub_category: "Web Development",
          trash: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Sample Diamond Book",
          description: "This is a sample diamond book description",
          url: "https://example.com/diamond-book",
          type: "diamond",
          category: "Programming",
          sub_category: "Database",
          trash: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("books", null, {});
  },
};
