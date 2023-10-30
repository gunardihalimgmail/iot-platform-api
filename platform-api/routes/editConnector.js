const express = require('express');
const apiController = require('../controllers/editConnector');
const router = express.Router();
router.post('/api-v1/editConnector', apiController.postCommand);

module.exports = router;