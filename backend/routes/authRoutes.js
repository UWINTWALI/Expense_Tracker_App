const express = require('express');
const { register, login, logoutHandler } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logoutHandler);

module.exports = router;




