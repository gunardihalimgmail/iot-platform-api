const express = require('express');
const apiController = require('../controllers/registerUser');
const router = express.Router();
router.post('/api-v1/registerUser', apiController.postCommand);

module.exports = router;