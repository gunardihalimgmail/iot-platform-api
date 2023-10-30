const express = require('express');
const apiController = require('../controllers/createAlert');
const router = express.Router();
router.post('/api-v1/createAlert', apiController.postCommand);

module.exports = router;