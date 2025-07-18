const pool = require('../db');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const existing = await pool.query('SELECT * FROM "Users" WHERE username = $1', [username]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const result = await pool.query(
      'INSERT INTO "Users" (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role',
      [username, password, role]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await pool.query('SELECT * FROM "Users" WHERE username = $1', [username]);
    const user = result.rows[0];
    if (!user || user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    // For demo, just return user info (no JWT)
    res.json({ id: user.id, username: user.username, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}; 