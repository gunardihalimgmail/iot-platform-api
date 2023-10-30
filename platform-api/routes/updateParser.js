const express = require('express');
const apiController = require('../controllers/updateParser');
const router = express.Router();
router.post('/api-v1/updateParser', apiController.postCommand);

module.exports = router;