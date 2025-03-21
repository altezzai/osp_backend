const { DataTypes } = require("sequelize");

const { ospSequelize } = require("../config/connection");

module.exports = (ospSequelize) => {
  const Team = ospSequelize.define(
    "Team",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      position: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        // unique: true,
        // validate: {
        //   isEmail: true,
        // },
      },
      status: {
        type: DataTypes.ENUM("active", "inactive"),
        defaultValue: "active",
        allowNull: false,
      },
      trash: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      modelName: "Team",
      tableName: "teams",
      timestamps: true,
    }
  );

  return Team;
};
