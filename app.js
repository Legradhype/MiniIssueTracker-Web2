const express = require('express');
const path = require('path');
require('dotenv').config();

const { sequelize } = require('./models');

// Rutas
const authRoutes = require('./routes/auth');
const proyectosRoutes = require('./routes/proyectos');
const ticketsRoutes = require('./routes/tickets');

const app = express();

// ============================================
// MIDDLEWARES GLOBALES
// ============================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ============================================
// MOTOR DE VISTAS EJS
// ============================================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ============================================
// RUTAS API
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/proyectos', proyectosRoutes);
app.use('/api/proyectos/:proyecto_id/tickets', ticketsRoutes);

// ============================================
// RUTAS DE VISTAS EJS
// ============================================

// Auth
app.get('/', (req, res) => res.redirect('/login'));
app.get('/login', (req, res) => res.render('auth/login'));
app.get('/register', (req, res) => res.render('auth/register'));

// Proyectos
app.get('/proyectos', (req, res) => res.render('cliente/proyectos'));
app.get('/proyectos/:id', (req, res) => res.render('cliente/detalle-proyecto'));
app.get('/proyectos/:id/tablero', (req, res) => res.render('cliente/tablero'));

// Tickets
app.get('/proyectos/:proyecto_id/tickets/:id', (req, res) => res.render('cliente/detalle-ticket'));

// ============================================
// MANEJO DE ERRORES GLOBAL
// ============================================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// ============================================
// CONEXIÓN DB + INICIO DEL SERVIDOR
// ============================================
const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => {
    console.log('✅ Conectado a PostgreSQL');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Error al conectar a la base de datos:', err);
    process.exit(1);
  });