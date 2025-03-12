const { DataTypes } = require("sequelize");

const { ospSequelize } = require("../config/connection");

module.exports = (ospSequelize) => {
  const TrendingStory = ospSequelize.define(
    "TrendingStory",
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
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("active", "inactive"),
        defaultValue: "active",
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        // defaultValue: DataTypes.NOW,
      },
      trash: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      modelName: "TrendingStory",
      tableName: "trendingstories",
      timestamps: true,
    }
  );

  return TrendingStory;
};
