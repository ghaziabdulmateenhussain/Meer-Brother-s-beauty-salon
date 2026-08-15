const Review = require('../models/Review');

// GET /api/reviews (public - only visible ones)
async function getReviews(req, res, next) {
  try {
    const filter = req.query.all === 'true' && req.user?.role === 'admin' ? {} : { visible: true };
    const reviews = await Review.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: reviews.length, reviews });
  } catch (err) {
    next(err);
  }
}

// POST /api/reviews (customer, must be logged in)
async function createReview(req, res, next) {
  try {
    const { rating, comment } = req.body;
    const review = await Review.create({
      customer: req.user._id,
      customerName: req.user.name,
      rating,
      comment,
      visible: true,
    });
    res.status(201).json({ success: true, review });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/reviews/:id (admin)
async function deleteReview(req, res, next) {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found.' });
    res.json({ success: true, message: 'Review deleted.' });
  } catch (err) {
    next(err);
  }
}

// PUT /api/reviews/:id/visibility (admin) body: { visible: boolean }
async function setReviewVisibility(req, res, next) {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { visible: req.body.visible },
      { new: true }
    );
    if (!review) return res.status(404).json({ success: false, message: 'Review not found.' });
    res.json({ success: true, review });
  } catch (err) {
    next(err);
  }
}

module.exports = { getReviews, createReview, deleteReview, setReviewVisibility };
