const express = require('express');
const router = express.Router();
const {
  getReviews,
  createReview,
  deleteReview,
  setReviewVisibility,
} = require('../controllers/reviewController');
const { protect, adminOnly } = require('../middleware/auth');

function optionalAuth(req, res, next) {
  const { protect: protectFn } = require('../middleware/auth');
  if (req.headers.authorization) return protectFn(req, res, next);
  next();
}

router.get('/', optionalAuth, getReviews);
router.post('/', protect, createReview);
router.delete('/:id', protect, adminOnly, deleteReview);
router.put('/:id/visibility', protect, adminOnly, setReviewVisibility);

module.exports = router;
