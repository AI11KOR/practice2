const express = require('express');
const router = express.Router();
const mallCtrl = require('../controller/mallController');
const checkJWTLogin = require('../middleware/checkJWTLogin');
const authJWT = require('../middleware/authJWT');

router.get('/shop', mallCtrl.shopPage);

router.get('/shop/productDetail/:id', mallCtrl.productDetail);

router.post('/addToCart', authJWT, checkJWTLogin, mallCtrl.addToCart); // 장바구니 상품 추가

router.get('/cart', authJWT, checkJWTLogin, mallCtrl.cartPage);

router.patch('/cart/updateCount', authJWT, checkJWTLogin, mallCtrl.updateCartCount);

router.delete('/cart/:cartId', authJWT, checkJWTLogin, mallCtrl.deleteCartItem)

router.get('/payment', authJWT, checkJWTLogin, mallCtrl.paymentPage);

router.post('/payment/success', authJWT, checkJWTLogin, mallCtrl.paymentSuccess);

router.get('/shop/search', mallCtrl.productSearch);



module.exports = router;