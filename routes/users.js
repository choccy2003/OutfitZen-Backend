var express = require('express');
const { userSignup, userLoginAuth, userSession, userCartUpdate } = require('../controllers/userAuthenticationControllers');
const { fetchProducts, fetchProductById } = require('../controllers/productContollers');
var router = express.Router();

router.post('/signup', userSignup);
router.post('/login', userLoginAuth);
router.post('/session', userSession);
router.get('/fetch-products', fetchProducts);
router.get('/fetch-products-by-id', fetchProductById);
router.post('/cart-update', userCartUpdate);

module.exports = router;
