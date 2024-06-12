const { Router } = require('express');
const JwtController = require('../controllers/JWTController');
const ACGController = require('../controllers/ACGController');

const router = Router();

router.get('/jwt/login', JwtController.login);
router.get('/jwt/logout', JwtController.logout);
router.get('/jwt/login-status', JwtController.isLoggedIn);

router.get('/passport/login', ACGController.login);
router.get('/passport/logout', ACGController.logout);
router.get('/passport/login-status', ACGController.isLoggedIn);
router.get('/passport/callback', [ACGController.dsLoginCB1, ACGController.dsLoginCB2]);

module.exports = router;
