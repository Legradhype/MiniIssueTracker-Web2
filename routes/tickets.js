const express = require('express');
const router = express.Router({ mergeParams: true });
const ticketController = require('../controllers/ticketController');
const auth = require('../middleware/authMiddleware');
const verificarProyecto = require('../middleware/proyectoMiddleware');
const { validar, schemas } = require('../middleware/validators');

router.use(auth);
router.use(verificarProyecto);

router.get('/', ticketController.listar);
router.post('/', validar(schemas.ticket), ticketController.crear);
router.get('/:id', ticketController.detalle);
router.put('/:id', validar(schemas.ticket), ticketController.editar);
router.patch('/:id/estado', ticketController.cambiarEstado);
router.delete('/:id', ticketController.eliminar);

module.exports = router;