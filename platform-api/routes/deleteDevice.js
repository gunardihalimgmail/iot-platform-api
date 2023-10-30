const express = require('express');
const apiController = require('../controllers/deleteDevice');
const router = express.Router();
router.post('/api-v1/deleteDevice', apiController.postCommand);

module.exports = router;