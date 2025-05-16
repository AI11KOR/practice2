const express = require('express');
const router = express.Router();
const authJWT = require('../middleware/authJWT');
const checkJWTLogin = require('../middleware/checkJWTLogin')
const chatCtrl = require('../controller/chatController')

router.get('/me', authJWT, checkJWTLogin, chatCtrl.getInfo);

router.get('/chat', authJWT, checkJWTLogin, chatCtrl.getChatMsg);
router.post('/chat', authJWT, checkJWTLogin, chatCtrl.saveMessage);

module.exports = router;