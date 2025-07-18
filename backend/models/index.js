const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.PG_URI, {
  dialect: 'postgres',
  logging: false,
});

const User = require('./User')(sequelize, DataTypes);
const MenuItem = require('./MenuItem')(sequelize, DataTypes);
const { Order, OrderItem } = require('./Order')(sequelize, DataTypes);

// Associations
User.hasMany(Order, { foreignKey: 'studentId' });
Order.belongsTo(User, { foreignKey: 'studentId', as: 'student' });

Order.belongsToMany(MenuItem, { through: OrderItem, foreignKey: 'orderId', otherKey: 'menuItemId' });
MenuItem.belongsToMany(Order, { through: OrderItem, foreignKey: 'menuItemId', otherKey: 'orderId' });

module.exports = { sequelize, User, MenuItem, Order, OrderItem }; 