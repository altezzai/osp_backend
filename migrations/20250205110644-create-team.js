"use strict";

const { all } = require("../routes/publicRoutes");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("teams", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      position: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
        // unique: true,
      },
      status: {
        type: Sequelize.ENUM("active", "inactive"),
        defaultValue: "active",
        allowNull: false,
      },
      trash: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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

    // Add indexes
    await queryInterface.addIndex("teams", ["name"]);
    await queryInterface.addIndex("teams", ["category"]);
    await queryInterface.addIndex("teams", ["email"]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("teams");
  },
};
