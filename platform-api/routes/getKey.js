const express = require('express');
const apiController = require('../controllers/getKey');
const router = express.Router();
router.post('/api-v1/getKey', apiController.postCommand);

module.exports = router;