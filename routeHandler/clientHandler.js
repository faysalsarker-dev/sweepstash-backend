const express = require('express');
const router = express.Router();

// Define routes
router.get('/w', async (req, res) => {
  console.log('hit');
  res.send('yes link correct');
});

module.exports = router;
