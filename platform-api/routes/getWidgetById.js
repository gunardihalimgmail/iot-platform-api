const express = require('express');
const apiController = require('../controllers/getWidgetById');
const router = express.Router();
router.post('/api-v1/getWidgetById', apiController.postCommand);

module.exports = router;