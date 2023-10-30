const express = require('express');
const apiController = require('../controllers/updateCallback');
const router = express.Router();
router.post('/api-v1/updateCallback', apiController.postCommand);

module.exports = router;