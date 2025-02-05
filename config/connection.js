const { Sequelize } = require("sequelize");
const config = require("./config.json");

const environment = process.env.NODE_ENV || "development";
const ospConfig = config[environment];
const knowledgeConfig = config["knowledge"];
const janewayConfig = config["janeway"];

const ospSequelize = new Sequelize(
  ospConfig.database,
  ospConfig.username,
  ospConfig.password,
  {
    host: ospConfig.host,
    dialect: ospConfig.dialect,
    freezeTableName: true,
    underscored: true,
    logging: false,
  }
);
const knowledgeSequelize = new Sequelize(
  knowledgeConfig.database,
  knowledgeConfig.username,
  knowledgeConfig.password,
  {
    host: knowledgeConfig.host,
    dialect: knowledgeConfig.dialect,
    freezeTableName: true,
    underscored: true,
    logging: false,
  }
);

const janewaySequelize = new Sequelize(
  janewayConfig.database,
  janewayConfig.username,
  janewayConfig.password,
  {
    host: janewayConfig.host,
    dialect: janewayConfig.dialect,
    freezeTableName: true,
    underscored: true,
    logging: false,
  }
);
module.exports = { knowledgeSequelize, janewaySequelize, ospSequelize };
