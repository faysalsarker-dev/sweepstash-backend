const bcrypt = require('bcrypt');

// Middleware function to hash the password
const HPMW = async (req, res, next) => {
  try {
    const { password } = req.body;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(password, salt);
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { HPMW };
