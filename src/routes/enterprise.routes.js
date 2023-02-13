const path = require('path');
const express = require('express');
const router = express.Router();
const enterpriseController = require(path.join(__dirname, '..', 'controllers', 'enterprise.controller'));

router.get('/', enterpriseController.getEnterprises);
router.get('/:id', enterpriseController.getEnterprise);

router.post('/', enterpriseController.createEnterprise);
router.post('/login', enterpriseController.login);
router.post('/:id/invite-member', enterpriseController.createMemberInvitation);

router.put('/:id', enterpriseController.updateEnterprise);

module.exports = router;