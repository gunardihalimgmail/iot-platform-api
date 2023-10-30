const express = require('express');
const apiController = require('../controllers/listUser');
const router = express.Router();
router.post('/api-v1/listUser', apiController.postCommand);

module.exports = router;