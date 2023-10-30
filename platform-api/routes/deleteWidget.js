const express = require('express');
const apiController = require('../controllers/deleteWidget');
const router = express.Router();
router.post('/api-v1/deleteWidget', apiController.postCommand);

module.exports = router;