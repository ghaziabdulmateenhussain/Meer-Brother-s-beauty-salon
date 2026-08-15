const { validationResult } = require('express-validator');

// Runs after express-validator chains; returns clean 400s instead of
// letting bad input reach controllers/DB.
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }
  next();
}

module.exports = validate;
