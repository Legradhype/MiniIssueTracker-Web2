const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
const auth = require('../middleware/authMiddleware');
const verificarProyecto = require('../middleware/proyectoMiddleware');
const { validar, schemas } = require('../middleware/validators');

router.use(auth);

router.get('/', proyectoController.listar);
router.get('/buscar/usuarios', proyectoController.buscarUsuarios);
router.post('/', validar(schemas.proyecto), proyectoController.crear);
router.get('/:id', verificarProyecto, proyectoController.detalle);
router.put('/:id', verificarProyecto, validar(schemas.proyecto), proyectoController.editar);
router.post('/:id/usuarios', verificarProyecto, proyectoController.agregarUsuario);

module.exports = router;