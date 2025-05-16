const express = require('express');
const router = express.Router();
const authCtrl = require('../controller/authController');
const emailCtrl = require('../controller/emailController');
const checkJWTLogin = require('../middleware/checkJWTLogin');
const authJWT = require('../middleware/authJWT');
const {upload} = require('../middleware/S3_upload');
const passport = require('passport')
require('../config/passportGoogle');
require('../config/passportKakao');
require('../config/passportNaver');
const socialCtrl = require('../controller/socialController')

router.post('/login', authCtrl.login);

router.post('/register', authCtrl.register);

router.post('/send-email', emailCtrl.sendBtn);

router.post('/verify-email', emailCtrl.verifyBtn);

router.get('/myPage', authJWT, checkJWTLogin, authCtrl.myPage);

router.post('/changeImg', authJWT, checkJWTLogin, upload.single('img'), authCtrl.changeImg);


router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }), // “세션 저장 안 할게! 로그인 결과만 받아서 내가 JWT로 처리할게!”
    (req, res) => {
        // ✅ 토큰 리다이렉트 응답
        res.redirect(`http://localhost:3001/social-login?token=${req.user.token}&email=${req.user.userEmail}`);
    }
);

router.get('/auth/kakao', passport.authenticate('kakao', { scope: ['account_email', 'profile_nickname'] }));
router.get('/auth/kakao/callback',
    passport.authenticate('kakao', { failureRedirect: '/login', session: false }),
    (req, res) => {
        res.redirect(`http://localhost:3001/social-login?token=${req.user.token}&email=${req.user.userEmail}`);
    }
);

router.get('/auth/naver', passport.authenticate('naver', {
    scope: ['email'],
    state: 'naverLogin'
}));
router.get('/auth/naver/callback',
    passport.authenticate('naver', { failureRedirect: '/login', session: false }),
    (req, res) => {
        res.redirect(`http://localhost:3001/social-login?token=${req.user.token}&email=${req.user.userEmail}`);
        // res.redirect(`/list?token=${req.user.token}`);
    }
);



module.exports = router;