const pool = require('../db');

exports.getMenuItems = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "MenuItems"');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addMenuItem = async (req, res) => {
  try {
    const { name, price } = req.body;
    const result = await pool.query(
      'INSERT INTO "MenuItems" (name, price) VALUES ($1, $2) RETURNING *',
      [name, price]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}; 