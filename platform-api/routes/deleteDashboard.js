const express = require('express');
const apiController = require('../controllers/deleteDashboard');
const router = express.Router();
router.post('/api-v1/deleteDashboard', apiController.postCommand);

module.exports = router;