const express = require('express');
const apiController = require('../controllers/createConnector');
const router = express.Router();
router.post('/api-v1/createConnector', apiController.postCommand);

module.exports = router;