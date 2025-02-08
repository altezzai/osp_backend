"use strict";
const { DataTypes } = require("sequelize");
const { knowledgeSequelize } = require("../../config/connection");
const College = knowledgeSequelize.define(
  "College",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    university_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    college_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    district: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    postal_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contact_phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contact_email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    principal: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    librarian_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    librarian_email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    number_of_departments: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    number_of_faculties: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    number_of_students: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    established_year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    theme_primary_color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    theme_secondary_color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    trash: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    modelName: "College",
    tableName: "colleges",
    timestamps: false,
  }
);
// College.hasMany(CollegeDepartments, { foreignKey: "collegeId" });
// CollegeDepartments.belongsTo(College, { foreignKey: "collegeId" });
module.exports = College;
