const express = require('express');
const apiController = require('../controllers/deleteShareDevice');
const router = express.Router();
router.post('/api-v1/deleteShareDevice', apiController.postCommand);

module.exports = router;