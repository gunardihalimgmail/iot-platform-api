const express = require('express');
const apiController = require('../controllers/listCallback');
const router = express.Router();
router.post('/api-v1/listCallback', apiController.postCommand);

module.exports = router;