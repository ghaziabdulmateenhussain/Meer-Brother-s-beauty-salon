const { body } = require('express-validator');

const createBookingRules = [
  body('serviceId').notEmpty().withMessage('Service is required.'),
  body('date')
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Date must be in YYYY-MM-DD format.'),
  body('time')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('Time must be in HH:mm format.'),
];

module.exports = { createBookingRules };
