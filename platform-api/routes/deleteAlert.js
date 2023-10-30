const express = require('express');
const apiController = require('../controllers/deleteAlert');
const router = express.Router();
router.post('/api-v1/deleteAlert', apiController.postCommand);

module.exports = router;