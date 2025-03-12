"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("book_publish", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      institution: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      department: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      book_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      subject_area: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      language: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      summary: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      current_stage: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      submit_idea: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      keywords: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      additional_information: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      file: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      trash: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: "Pending",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("book_publish");
  },
};
