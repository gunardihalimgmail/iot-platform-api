const express = require('express');
const apiController = require('../controllers/updateWidget');
const router = express.Router();
router.post('/api-v1/updateWidget', apiController.postCommand);

module.exports = router;