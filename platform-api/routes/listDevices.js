const express = require('express');
const apiController = require('../controllers/listDevice');
const router = express.Router();
router.get('/api-v1/listDevice', apiController.postCommand);

module.exports = router;