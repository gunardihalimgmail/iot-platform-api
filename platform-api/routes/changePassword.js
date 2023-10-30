const express = require('express');
const apiController = require('../controllers/changePassword');
const router = express.Router();
router.post('/api-v1/changePassword', apiController.postCommand);

module.exports = router;