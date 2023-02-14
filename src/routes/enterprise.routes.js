const path = require('path');
const express = require('express');
const router = express.Router();
const enterpriseController = require(path.join(__dirname, '..', 'controllers', 'enterprise.controller'));

router.get('/', enterpriseController.getEnterprises);
router.get('/:id', enterpriseController.getEnterprise);

router.post('/', enterpriseController.createEnterprise);
router.post('/:id/invite-member', enterpriseController.createMemberInvitation);
router.post('/:id/read-excel', enterpriseController.readExcelWithMails);

router.put('/:id', enterpriseController.updateEnterprise);

module.exports = router;