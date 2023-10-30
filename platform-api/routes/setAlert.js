const express = require('express');
const apiController = require('../controllers/setAlert');
const router = express.Router();
router.post('/api-v1/setAlert', apiController.postCommand);

module.exports = router;