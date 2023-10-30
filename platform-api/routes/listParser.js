const express = require('express');
const apiController = require('../controllers/listParser');
const router = express.Router();
router.get('/api-v1/listParser', apiController.postCommand);

module.exports = router;