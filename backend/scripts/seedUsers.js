const { sequelize, User } = require('../models');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const users = [
  { username: 'owner1', password: 'ownerpass', role: 'owner' },
  { username: 'student1', password: 'studentpass1', role: 'student' },
  { username: 'student2', password: 'studentpass2', role: 'student' },
  { username: 'student3', password: 'studentpass3', role: 'student' }
];

async function seed() {
  await sequelize.sync();
  for (const user of users) {
    const existing = await User.findOne({ where: { username: user.username } });
    if (!existing) {
      const hashed = await bcrypt.hash(user.password, 10);
      await User.create({ username: user.username, password: hashed, role: user.role });
      console.log(`Created user: ${user.username}`);
    } else {
      console.log(`User already exists: ${user.username}`);
    }
  }
  await sequelize.close();
  console.log('Done.');
}

seed(); 