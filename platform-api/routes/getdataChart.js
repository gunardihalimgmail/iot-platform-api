const express = require('express');
const apiController = require('../controllers/getdataChart');
const router = express.Router();
router.post('/api-v1/getdataChart', apiController.postCommand);

module.exports = router;