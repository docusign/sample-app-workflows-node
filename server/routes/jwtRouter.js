const { Router } = require('express');
const JwtController = require('../controllers/jwtController');

const router = Router();

router.get('/isLoggedIn', JwtController.isLoggedIn);
router.get('/login', JwtController.login);
router.get('/logout', JwtController.logout);

module.exports = router;
