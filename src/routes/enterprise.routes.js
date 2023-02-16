const path = require('path');
const express = require('express');
const router = express.Router();
const enterpriseController = require(path.join(__dirname, '..', 'controllers', 'enterprise.controller'));
const cardTemplateController = require(path.join(__dirname, '..', 'controllers', 'cardTemplate.controller'));

router.get('/', enterpriseController.getEnterprises);
router.get('/:id', enterpriseController.getEnterprise);

router.post('/', enterpriseController.createEnterprise);
router.post('/:id/invite-member', enterpriseController.createMemberInvitation);
router.post('/:id/read-excel', enterpriseController.readExcelWithMails);

router.put('/:id', enterpriseController.updateEnterprise);


/* rutas de roles de empresa */
router.post('/rol', enterpriseController.createEnterpriseRol);
router.put('/rol/:idEnterpriseRol', enterpriseController.updateEnterpriseRol);
router.delete('/rol/:idEnterpriseRol', enterpriseController.deleteEnterpriseRol);


/* rutas de manejo de usuarios */
router.put('/:idUser/permissions', enterpriseController.updateUserPermissions);
router.put('/:idUser/update-rol', enterpriseController.updateRolFromUser);

/* rutas de templates */
router.post('/create-template', cardTemplateController.createTemplate);

module.exports = router;