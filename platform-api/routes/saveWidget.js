const express = require('express');
const apiController = require('../controllers/saveWidget');
const router = express.Router();
router.post('/api-v1/saveWidget', apiController.postCommand);

module.exports = router;