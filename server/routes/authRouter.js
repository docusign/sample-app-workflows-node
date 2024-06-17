const { Router } = require('express');

const router = Router();

router.get('/jwt/login', (req, res, next) => req.dsAuth.login(req, res, next));
router.get('/jwt/logout', (req, res, next) => req.dsAuth.logout(req, res, next));
router.get('/jwt/login-status', (req, res, next) => req.dsAuth.isLoggedIn(req, res, next));

router.get('/passport/login', (req, res, next) => req.dsAuth.login(req, res, next));
router.get('/passport/logout', (req, res, next) => req.dsAuth.logout(req, res, next));
router.get('/passport/login-status', (req, res, next) => req.dsAuth.isLoggedIn(req, res, next));
router.get('/passport/callback', [
  (req, res, next) => req.dsAuth.oauthCallback1(req, res, next),
  (req, res, next) => req.dsAuth.oauthCallback2(req, res, next),
]);

module.exports = router;
