const express = require('express');
const { signUp } = require('../controllers/authController.js');
const { signIn } = require('../controllers/authController.js');
const { signOut } = require('../controllers/authController.js');
const router = express.Router();

router.post('/signup', signUp);
router.post('/signin',signIn);
router.post('/signout',signOut);
module.exports = router;
