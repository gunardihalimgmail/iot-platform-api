const express = require('express');
const apiController = require('../controllers/updateAlert');
const router = express.Router();
router.post('/api-v1/updateAlert', apiController.postCommand);

module.exports = router;