const express = require('express');
const apiController = require('../controllers/deleteConnector');
const router = express.Router();
router.post('/api-v1/deleteConnector', apiController.postCommand);

module.exports = router;