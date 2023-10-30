const express = require('express');
const apiController = require('../controllers/createDeviceSharing');
const router = express.Router();
router.post('/api-v1/createDeviceSharing', apiController.postCommand);

module.exports = router;