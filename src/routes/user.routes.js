const path = require('path');
const express = require('express');
const router = express.Router();
const userController = require(path.join(__dirname, '..', 'controllers', 'user.controller'));

router.post('/register/:enterpriseId', userController.register);

router.get('/getUsersByEnterprise/:enterpriseId', userController.getUsersByEnterprise);

router.put('/:userId', userController.updateUser);

module.exports = router;