const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validar, schemas } = require('../middleware/validators');

router.post('/register', validar(schemas.register), authController.register);
router.post('/login', validar(schemas.login), authController.login);

module.exports = router;