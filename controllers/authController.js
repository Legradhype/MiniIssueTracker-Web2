const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const authController = {
  async register(req, res) {
    const { nombre, email, password } = req.body;
    try {
      const existe = await Usuario.findOne({ where: { email } });
      if (existe) return res.status(400).json({ error: 'Email ya registrado' });

      const hash = await bcrypt.hash(password, 10);
      const usuario = await Usuario.create({ nombre, email, password: hash });

      res.status(201).json({ id: usuario.id, nombre: usuario.nombre, email: usuario.email });
    } catch (err) {
      res.status(500).json({ error: 'Error al registrar usuario' });
    }
  },

  async login(req, res) {
    const { email, password } = req.body;
    try {
      const usuario = await Usuario.findOne({ where: { email } });
      if (!usuario) return res.status(401).json({ error: 'Credenciales inválidas' });

      const valido = await bcrypt.compare(password, usuario.password);
      if (!valido) return res.status(401).json({ error: 'Credenciales inválidas' });

      const token = jwt.sign(
        { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      );
      res.json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email } });
    } catch (err) {
      res.status(500).json({ error: 'Error al iniciar sesión' });
    }
  }
};

module.exports = authController;