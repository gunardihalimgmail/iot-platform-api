const express = require('express');
const apiController = require('../controllers/getcsvAll');
const router = express.Router();
router.get('/api-v1/getcsvAll', apiController.postCommand);

module.exports = router;