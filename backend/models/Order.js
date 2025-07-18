module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  });

  const OrderItem = sequelize.define('OrderItem', {
    quantity: { type: DataTypes.INTEGER, allowNull: false }
  });

  return { Order, OrderItem };
}; 