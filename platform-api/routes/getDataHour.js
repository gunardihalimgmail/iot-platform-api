const express = require('express');
const apiController = require('../controllers/getDataHour');
const router = express.Router();
router.post('/api-v1/getDataHour', apiController.postCommand);

module.exports = router;