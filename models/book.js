const { DataTypes } = require("sequelize");

const { ospSequelize } = require("../config/connection");

module.exports = (ospSequelize) => {
  const Book = ospSequelize.define(
    "Book",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      type: {
        type: DataTypes.ENUM("ruby", "diamond"),
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sub_category: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      trash: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      modelName: "Book",
      tableName: "books",
      timestamps: true,
    }
  );

  return Book;
};
