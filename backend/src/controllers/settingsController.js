const BusinessSettings = require('../models/BusinessSettings');

async function getSettings(req, res, next) {
  try {
    let settings = await BusinessSettings.findOne();
    if (!settings) settings = await BusinessSettings.create({});
    res.json({ success: true, settings });
  } catch (err) {
    next(err);
  }
}

async function updateSettings(req, res, next) {
  try {
    let settings = await BusinessSettings.findOne();
    if (!settings) {
      settings = await BusinessSettings.create(req.body);
    } else {
      Object.assign(settings, req.body);
      await settings.save();
    }
    res.json({ success: true, settings });
  } catch (err) {
    next(err);
  }
}

module.exports = { getSettings, updateSettings };
