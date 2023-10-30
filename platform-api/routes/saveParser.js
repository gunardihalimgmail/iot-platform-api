const express = require('express');
const apiController = require('../controllers/saveParser');
const router = express.Router();
router.post('/api-v1/saveParser', apiController.postCommand);

module.exports = router;