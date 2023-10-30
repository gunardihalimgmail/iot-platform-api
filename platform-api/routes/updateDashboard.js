const express = require('express');
const apiController = require('../controllers/updateDashboard');
const router = express.Router();
router.post('/api-v1/updateDashboard', apiController.postCommand);

module.exports = router;