const express = require('express');
const apiController = require('../controllers/listDashboard');
const router = express.Router();
router.get('/api-v1/getListDashboard', apiController.postCommand);

module.exports = router;