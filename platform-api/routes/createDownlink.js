const express = require('express');
const apiController = require('../controllers/createDownlink');
const router = express.Router();
router.post('/api-v1/createDownlink', apiController.postCommand);

module.exports = router;