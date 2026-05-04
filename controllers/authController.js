const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const authController = {
  async register(req, res) {
    const { nombre, email, password } = req.body;
    
    console.log('📝 [AUTH] Datos recibidos en register:', { nombre, email, password: '****' });
    

    if (!nombre || !email || !password) {
      console.log('[AUTH] Campos faltantes:', { nombre: !!nombre, email: !!email, password: !!password });
      return res.status(400).json({ error: 'Faltan campos requeridos: nombre, email y password' });
    }
    
    try {
      const existe = await Usuario.findOne({ where: { email } });
      if (existe) {
        console.log('[AUTH] Email ya registrado:', email);
        return res.status(400).json({ error: 'Email ya registrado' });
      }

      const hash = await bcrypt.hash(password, 10);
      const usuario = await Usuario.create({ nombre, email, password: hash });

      console.log(' [AUTH] Usuario registrado exitosamente:', usuario.id);
      res.status(201).json({ id: usuario.id, nombre: usuario.nombre, email: usuario.email });
    } catch (err) {
      console.error(' [AUTH] Error en register:', err);
      res.status(500).json({ error: 'Error al registrar usuario', detalle: err.message });
    }
  },

  async login(req, res) {
    const { email, password } = req.body;
    console.log('🔐 [AUTH] Intento de login para:', email);
    
    try {
      const usuario = await Usuario.findOne({ where: { email } });
      if (!usuario) {
        console.log('[AUTH] Usuario no encontrado:', email);
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      const valido = await bcrypt.compare(password, usuario.password);
      if (!valido) {
        console.log('[AUTH] Contraseña incorrecta para:', email);
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      const token = jwt.sign(
        { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      );
      console.log('✅ [AUTH] Login exitoso:', email);
      res.json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email } });
    } catch (err) {
      console.error(' [AUTH] Error en login:', err);
      res.status(500).json({ error: 'Error al iniciar sesión', detalle: err.message });
    }
  }
};

module.exports = authController;