"use strict";

const { DataTypes } = require("sequelize");
const { knowledgeSequelize } = require("../../config/connection");
// const CollegeDepartments = require("./collegeDepartment");

const Department = knowledgeSequelize.define(
  "Department",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    department_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    schoolOf: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    trash: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  },
  {
    modelName: "Department",
    tableName: "departments",
    timestamps: true,
  }
);
// Department.hasMany(CollegeDepartments, {
//   foreignKey: "departmentId",
// });
// CollegeDepartments.belongsTo(Department, {
//   foreignKey: "departmentId",
// });
module.exports = Department;
