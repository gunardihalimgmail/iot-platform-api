const express = require('express');
const apiController = require('../controllers/updateDevice');
const router = express.Router();
router.post('/api-v1/updateDevice', apiController.postCommand);

module.exports = router;