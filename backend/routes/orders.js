const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/', orderController.getOrders); // Owner views all orders
router.post('/', orderController.placeOrder); // Student places order
router.get('/frequent', orderController.getMostFrequentItem); // Most frequent item for quick order

module.exports = router; 