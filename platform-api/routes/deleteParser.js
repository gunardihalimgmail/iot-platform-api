const express = require('express');
const apiController = require('../controllers/deleteParser');
const router = express.Router();
router.post('/api-v1/deleteParser', apiController.postCommand);

module.exports = router;