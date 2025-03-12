const { DataTypes } = require("sequelize");

const { ospSequelize } = require("../config/connection");

module.exports = (ospSequelize) => {
  const ContactUs = ospSequelize.define(
    "ContactUs",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      job: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      institution: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      topic: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      trash: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      modelName: "ContactUs",
      tableName: "contactus",
      timestamps: true,
    }
  );

  return ContactUs;
};
