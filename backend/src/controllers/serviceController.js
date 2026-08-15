const Service = require('../models/Service');

// GET /api/services (public - only active ones; admin can pass ?all=true)
async function getServices(req, res, next) {
  try {
    const filter = req.query.all === 'true' && req.user?.role === 'admin' ? {} : { active: true };
    if (req.query.category) filter.category = req.query.category;

    const services = await Service.find(filter).sort({ category: 1, name: 1 });
    res.json({ success: true, count: services.length, services });
  } catch (err) {
    next(err);
  }
}

// GET /api/services/:id
async function getServiceById(req, res, next) {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found.' });
    res.json({ success: true, service });
  } catch (err) {
    next(err);
  }
}

// POST /api/services (admin)
async function createService(req, res, next) {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, service });
  } catch (err) {
    next(err);
  }
}

// PUT /api/services/:id (admin)
async function updateService(req, res, next) {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!service) return res.status(404).json({ success: false, message: 'Service not found.' });
    res.json({ success: true, service });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/services/:id (admin)
async function deleteService(req, res, next) {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found.' });
    res.json({ success: true, message: 'Service deleted.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getServices, getServiceById, createService, updateService, deleteService };
