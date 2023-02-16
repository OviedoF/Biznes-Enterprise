const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/template-excel-addusers', (req, res) => {
    res.download(path.join(__dirname, '..', 'public', 'static', 'Template_Biznes_UsersAdd.xlsx'));
});


module.exports = router;