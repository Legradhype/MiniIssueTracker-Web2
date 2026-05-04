const express = require('express');
const path = require('path');
require('dotenv').config();

console.log("El puerto de la DB es:", process.env.DB_PORT);

const { sequelize } = require('./models');


const authRoutes = require('./routes/auth');
const proyectosRoutes = require('./routes/proyectos');
const ticketsRoutes = require('./routes/tickets');

const app = express();

app.use(express.json({ 
  limit: '10kb',
  strict: true
})); 

app.use(express.urlencoded({ 
  extended: true,
  limit: '10kb'
})); 

app.use(express.static(path.join(__dirname, 'public')));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use('/api/auth', authRoutes);
app.use('/api/proyectos', proyectosRoutes);
app.use('/api/proyectos/:proyecto_id/tickets', ticketsRoutes);


app.get('/', (req, res) => res.redirect('/login'));
app.get('/login', (req, res) => res.render('auth/login'));
app.get('/register', (req, res) => res.render('auth/register'));


app.post('/api/test-json', (req, res) => {
  console.log('🧪 [TEST] req.body:', req.body);
  console.log('🧪 [TEST] req.body tipo:', typeof req.body);
  res.json({ 
    status: 'ok', 
    received: req.body,
    isEmpty: Object.keys(req.body || {}).length === 0
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    server: 'running',
    middleware: {
      expressJson: 'enabled',
      expressUrlencoded: 'enabled'
    }
  });
});

app.get('/proyectos', (req, res) => res.render('cliente/proyectos'));
app.get('/proyectos/:id', (req, res) => res.render('cliente/detalle-proyecto'));
app.get('/proyectos/:id/tablero', (req, res) => res.render('cliente/tablero'));
app.get('/proyectos/:proyecto_id/tickets/:id', (req, res) => res.render('cliente/detalle-ticket'));

// Middleware para manejar errores globales
app.use((err, req, res, next) => {
  console.error("Error detectado:", err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;

// --- Conexión a DB y Arranque ---
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