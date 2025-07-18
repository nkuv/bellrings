const pool = require('../db');

exports.getOrders = async (req, res) => {
  try {
    const { day } = req.query;
    let query = `
      SELECT
        o.id AS order_id,
        o.day,
        COALESCE(u.username, 'N/A') AS student_username,
        json_agg(
          json_build_object(
            'name', m.name,
            'quantity', oi.quantity
          )
        ) FILTER (WHERE m.id IS NOT NULL) AS items
      FROM "Orders" o
      LEFT JOIN "Users" u ON o.studentId = u.id
      LEFT JOIN "OrderItems" oi ON oi.orderId = o.id
      LEFT JOIN "MenuItems" m ON oi.menuItemId = m.id
    `;
    const params = [];
    if (day) {
      query += ' WHERE o.day = $1';
      params.push(day);
    }
    query += ' GROUP BY o.id, o.day, u.username ORDER BY o.id DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.placeOrder = async (req, res) => {
  // Force all new orders to use studentId = 2
  const studentId = 2;
  const { items } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Get the menuItemId for 'meals'
    const mealRes = await client.query('SELECT id FROM "MenuItems" WHERE name = $1', ['meals']);
    if (mealRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Meals item not found' });
    }
    const mealsId = mealRes.rows[0].id;

    // 2. Calculate meals ordered today
    const today = new Date().toISOString().slice(0, 10);
    const mealsCountRes = await client.query(`
      SELECT COALESCE(SUM(oi.quantity), 0) AS total
      FROM "Orders" o
      JOIN "OrderItems" oi ON oi.orderId = o.id
      WHERE o.day = $1 AND oi.menuItemId = $2
    `, [today, mealsId]);
    const mealsOrderedToday = Number(mealsCountRes.rows[0].total);

    // 3. Calculate meals in this order
    const mealsInOrder = items
      .filter(item => Number(item.menuItemId) === Number(mealsId))
      .reduce((sum, item) => sum + Number(item.quantity), 0);

    if (mealsOrderedToday + mealsInOrder > 200) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Daily meal limit reached' });
    }

    // 4. Place the order as usual
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

exports.getMostFrequentItem = async (req, res) => {
  const { studentId } = req.query;
  if (!studentId) return res.status(400).json({ message: 'studentId required' });
  try {
    const result = await pool.query(`
      SELECT oi.menuItemId, m.name, SUM(oi.quantity) as total
      FROM "Orders" o
      JOIN "OrderItems" oi ON oi.orderId = o.id
      JOIN "MenuItems" m ON oi.menuItemId = m.id
      WHERE o.studentId = $1
      GROUP BY oi.menuItemId, m.name
      ORDER BY total DESC
      LIMIT 1
    `, [studentId]);
    if (result.rows.length === 0) {
      return res.json({});
    }
    // Log the quick order usage
    await pool.query(
      'INSERT INTO "QuickOrderLogs" (studentId, menuItemId) VALUES ($1, $2)',
      [studentId, result.rows[0].menuitemid]
    );
    res.json({ menuItemId: result.rows[0].menuitemid, menuItemName: result.rows[0].name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProfit = async (req, res) => {
  const { day } = req.query;
  if (!day) return res.status(400).json({ message: 'day required' });
  try {
    const result = await pool.query(`
      SELECT COALESCE(SUM(oi.quantity * m.price), 0) AS profit
      FROM "Orders" o
      JOIN "OrderItems" oi ON oi.orderId = o.id
      JOIN "MenuItems" m ON oi.menuItemId = m.id
      WHERE o.day = $1
    `, [day]);
    res.json({ profit: Number(result.rows[0].profit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}; 