const express = require('express');
const apiController = require('../controllers/getScript');
const router = express.Router();
router.post('/api-v1/getScript', apiController.postCommand);

module.exports = router;