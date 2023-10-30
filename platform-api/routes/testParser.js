const express = require('express');
const apiController = require('../controllers/testParser');
const router = express.Router();
router.post('/api-v1/testParser', apiController.postCommand);

module.exports = router;