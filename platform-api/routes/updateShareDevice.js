const express = require('express');
const apiController = require('../controllers/updateShareDevice');
const router = express.Router();
router.post('/api-v1/updateShareDevice', apiController.postCommand);

module.exports = router;