const express = require('express');
const router = express.Router();
const { getMyLoyalty, getAllLoyalty } = require('../controllers/loyaltyController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/my', protect, getMyLoyalty);
router.get('/', protect, adminOnly, getAllLoyalty);

module.exports = router;
