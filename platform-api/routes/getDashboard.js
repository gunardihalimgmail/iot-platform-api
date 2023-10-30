const express = require('express');
const apiController = require('../controllers/getDashboard');
const router = express.Router();
router.get('/api-v1/getDashboard', apiController.postCommand);

module.exports = router;