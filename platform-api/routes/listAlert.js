const express = require('express');
const apiController = require('../controllers/listAlert');
const router = express.Router();
router.post('/api-v1/listAlert', apiController.postCommand);

module.exports = router;