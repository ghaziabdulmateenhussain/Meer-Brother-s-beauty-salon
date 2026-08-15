const express = require('express');
const router = express.Router();
const {
  getGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} = require('../controllers/galleryController');
const { protect, adminOnly } = require('../middleware/auth');

function optionalAuth(req, res, next) {
  const { protect: protectFn } = require('../middleware/auth');
  if (req.headers.authorization) return protectFn(req, res, next);
  next();
}

router.get('/', optionalAuth, getGallery);
router.post('/', protect, adminOnly, createGalleryItem);
router.put('/:id', protect, adminOnly, updateGalleryItem);
router.delete('/:id', protect, adminOnly, deleteGalleryItem);

module.exports = router;
