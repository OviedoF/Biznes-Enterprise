const path = require('path');
const express = require('express');
const router = express.Router();
const authController = require(path.join(__dirname, '..', 'controllers', 'auth.controller'));

router.post('/login', authController.login);

module.exports = router;