const { Router } = require('express');
const ACGController = require('../controllers/ACGController');

const router = Router();

router.get('/jwt/login', (req, res, next) => req.dsAuth.login(req, res, next));
router.get('/jwt/logout', (req, res, next) => req.dsAuth.logout(req, res, next));
router.get('/jwt/login-status', (req, res, next) => req.dsAuth.isLoggedIn(req, res, next));

router.get('/passport/login', ACGController.login);
router.get('/passport/logout', ACGController.logout);
router.get('/passport/login-status', ACGController.isLoggedIn);
router.get('/passport/callback', [ACGController.dsLoginCB1, ACGController.dsLoginCB2]);

module.exports = router;
