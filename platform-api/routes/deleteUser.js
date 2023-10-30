const express = require('express');
const apiController = require('../controllers/deleteUser');
const router = express.Router();
router.post('/api-v1/deleteUser', apiController.postCommand);

module.exports = router;