const express = require('express');
const router = express.Router();
const { authMe } = require('../controllers/user.controller.js');
router.get('/me',authMe);
module.exports = router;