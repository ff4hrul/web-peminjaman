const { DataTypes } = require('sequelize');
const db = require('../Config/database');

const Borrow = db.define('Borrow', {
  borrower: { type: DataTypes.STRING, allowNull: false },
  itemName: { type: DataTypes.STRING, allowNull: false },
  itemId: { type: DataTypes.INTEGER, allowNull: false },
  date: { type: DataTypes.STRING, allowNull: false },
  duration: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'Dipinjam' }, // 'Dipinjam' atau 'Dikembalikan'
});

module.exports = Borrow;
