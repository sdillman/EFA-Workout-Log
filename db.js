const Sequelize = require('sequelize');

const sequelize = new Sequelize ("postgres://postgres:eb6b832da9d3427dba30a45c56d23721@localhost:5432/wol");

module.exports = sequelize;