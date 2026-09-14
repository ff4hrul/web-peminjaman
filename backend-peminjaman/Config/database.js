const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite', // File database otomatis dibuat di sini
  logging: false,
});

module.exports = sequelize;
