const express = require('express');
const apiController = require('../controllers/getDataToday');
const router = express.Router();
router.post('/api-v1/getDataToday', apiController.postCommand);

module.exports = router;