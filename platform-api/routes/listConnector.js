const express = require('express');
const apiController = require('../controllers/listConnector');
const router = express.Router();
router.post('/api-v1/listConnector', apiController.postCommand);

module.exports = router;