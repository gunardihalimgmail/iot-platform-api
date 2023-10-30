const express = require('express');
const apiController = require('../controllers/createWidget');
const router = express.Router();
router.post('/api-v1/createWidget', apiController.postCommand);

module.exports = router;