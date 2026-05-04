const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');
const { validar, schemas } = require('../middleware/validators');

router.post('/register', validar(schemas.register), authController.register);
router.post('/login', validar(schemas.login), authController.login);
router.post('/logout', auth, (req, res) => {
  res.json({ mensaje: 'Sesión cerrada correctamente' });
});

module.exports = router;