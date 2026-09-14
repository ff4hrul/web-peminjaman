const { DataTypes } = require('sequelize');
const db = require('../Config/database'); // Pastikan 'C' besar sesuai nama folder

const Item = db.define(
  'Item',
  {
    name: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    total: { type: DataTypes.INTEGER, defaultValue: 1 },
    available: { type: DataTypes.INTEGER, defaultValue: 1 },
  },
  {
    tableName: 'Items', // Menjaga konsistensi nama tabel di SQLite
  },
);

module.exports = Item;
