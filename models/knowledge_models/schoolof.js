const { DataTypes } = require("sequelize");
const { knowledgeSequelize } = require("../../config/connection");

const SchoolOf = knowledgeSequelize.define(
  "SchoolOf",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    schoolOf: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    modelName: "SchoolOf",
    tableName: "school_ofs",
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = SchoolOf;
