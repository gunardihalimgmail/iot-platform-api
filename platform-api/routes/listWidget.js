const express = require('express');
const apiController = require('../controllers/listWidget');
const router = express.Router();
router.post('/api-v1/listWidget', apiController.postCommand);

module.exports = router;