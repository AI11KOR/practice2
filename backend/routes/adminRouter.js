const express = require('express');
const router = express.Router();
const adminCtrl = require('../controller/adminController');
const authJWT = require('../middleware/authJWT');
const checkJWTLogin = require('../middleware/checkJWTLogin');
const isAdmin = require('../middleware/checkAdmin');
const { upload } = require('../middleware/S3_upload');

router.get('/dashboard', authJWT, isAdmin, adminCtrl.adminDashBoard);


router.delete('/delete/:id', authJWT, isAdmin, adminCtrl.adminDelete);


module.exports = router;