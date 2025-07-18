const pool = require('../db');

exports.getOrders = async (req, res) => {
  try {
    const { day } = req.query;
    let ordersQuery = `SELECT o.id, o.day, u.username as student, 
      json_agg(json_build_object('name', m.name, 'quantity', oi.quantity)) as items
      FROM "Orders" o
      JOIN "Users" u ON o.studentId = u.id
      JOIN "OrderItems" oi ON oi.orderId = o.id
      JOIN "MenuItems" m ON oi.menuItemId = m.id`;
    const params = [];
    if (day) {
      ordersQuery += ' WHERE o.day = $1';
      params.push(day);
    }
    ordersQuery += ' GROUP BY o.id, o.day, u.username ORDER BY o.id DESC';
    const result = await pool.query(ordersQuery, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.placeOrder = async (req, res) => {
  const { studentId, items } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const orderResult = await client.query(
      'INSERT INTO "Orders" (studentId, day) VALUES ($1, CURRENT_DATE) RETURNING id',
      [studentId]
    );
    const orderId = orderResult.rows[0].id;
    for (const item of items) {
      await client.query(
        'INSERT INTO "OrderItems" (orderId, menuItemId, quantity) VALUES ($1, $2, $3)',
        [orderId, item.menuItemId, item.quantity]
      );
    }
    await client.query('COMMIT');
    res.status(201).json({ orderId });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    client.release();
  }
}; 