const { Sequelize } = require("sequelize");
const { ospSequelize } = require("../config/connection");
const config = require("../config/config.json")["development"];
const fs = require("fs");
const path = require("path");

const db = {};

// Import all models
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== "index.js" && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(ospSequelize);
    db[model.name] = model;
  });

db.sequelize = ospSequelize;
db.Sequelize = Sequelize;

module.exports = db;
