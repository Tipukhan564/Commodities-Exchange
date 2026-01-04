require('dotenv').config();
const connectDB = require('../config/db');
const { updateIndicators } = require('../controllers/commodityController');

(async () => {
  await connectDB();
  await updateIndicators();
  process.exit();
})();
