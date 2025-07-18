module.exports = (sequelize, DataTypes) => {
  const MenuItem = sequelize.define('MenuItem', {
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false }
  });
  return MenuItem;
}; 