const express = require('express');
const apiController = require('../controllers/getDataDate');
const router = express.Router();
router.post('/api-v1/getDataDate', apiController.postCommand);

module.exports = router;