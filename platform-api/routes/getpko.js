const express = require('express');
const apiController = require('../controllers/getPKOdata');
const router = express.Router();
router.get('/api-v1/getMassaJenisPKO', apiController.postCommand);

module.exports = router;