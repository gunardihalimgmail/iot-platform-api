const express = require('express');
const apiController = require('../controllers/createDashboard');
const router = express.Router();
router.post('/api-v1/createDashboard', apiController.postCommand);

module.exports = router;