const express = require('express');
const apiController = require('../controllers/createCallback');
const router = express.Router();
router.post('/api-v1/createCallback', apiController.postCommand);

module.exports = router;