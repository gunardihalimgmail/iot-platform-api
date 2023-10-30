const express = require('express');
const apiController = require('../controllers/getAllData');
const router = express.Router();
router.post('/api-v1/getAllData', apiController.postCommand);

module.exports = router;