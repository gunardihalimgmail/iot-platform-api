const express = require('express');
const apiController = require('../controllers/getDeviceOverviewNew');
const router = express.Router();
router.get('/api-v1/getDeviceOverview', apiController.postCommand);

module.exports = router;