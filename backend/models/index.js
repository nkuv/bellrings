const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.PG_URI || 'postgres://postgres:postgres@localhost:5432/bellrings', {
  dialect: 'postgres',
  logging: false,
});

const User = require('./User')(sequelize);
const MenuItem = require('./MenuItem')(sequelize);
const Order = require('./Order')(sequelize, User, MenuItem);

// Associations
User.hasMany(Order, { foreignKey: 'studentId' });
Order.belongsTo(User, { foreignKey: 'studentId', as: 'student' });

Order.belongsToMany(MenuItem, { through: 'OrderItems', foreignKey: 'orderId', otherKey: 'menuItemId' });
MenuItem.belongsToMany(Order, { through: 'OrderItems', foreignKey: 'menuItemId', otherKey: 'orderId' });

module.exports = { sequelize, User, MenuItem, Order }; 