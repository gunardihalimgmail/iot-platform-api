const express = require('express');
const apiController = require('../controllers/login');
const router = express.Router();
router.post('/api-v1/login', apiController.postCommand);

module.exports = router;