const express = require('express');
const apiController = require('../controllers/deleteCallback');
const router = express.Router();
router.post('/api-v1/deleteCallback', apiController.postCommand);

module.exports = router; 