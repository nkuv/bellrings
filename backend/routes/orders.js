const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/', orderController.getOrders); // Owner views all orders
router.post('/', orderController.placeOrder); // Student places order

module.exports = router; 