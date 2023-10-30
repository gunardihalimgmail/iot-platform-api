const express = require('express');
const apiController = require('../controllers/getLastData');
const router = express.Router();
router.post('/api-v1/getLastData', apiController.postCommand);

module.exports = router;