const express = require('express');
const router = express.Router();
const postCtrl = require('../controller/postController');
const authJWT = require('../middleware/authJWT');
const checkJWTLogin = require('../middleware/checkJWTLogin')

router.post('/write', authJWT, checkJWTLogin, postCtrl.writePage);

router.get('/list', postCtrl.listPage);

router.get('/edit/:id', authJWT, checkJWTLogin, postCtrl.editPage);

router.post('/edit/:id', authJWT, checkJWTLogin, postCtrl.edit);

router.get('/detail/:id', postCtrl.detailPage);

router.delete('/delete/:id', authJWT, checkJWTLogin, postCtrl.delete);

// 좋아요
router.post('/like/:id', authJWT, checkJWTLogin, postCtrl.likePost);

// 댓글 기능
router.post('/comment/:id', authJWT, checkJWTLogin, postCtrl.commentPost);

router.delete('/comment/:postId/:commentId', authJWT, checkJWTLogin, postCtrl.commentDelete);

router.get('/list/search', postCtrl.searchPosts);

module.exports = router;