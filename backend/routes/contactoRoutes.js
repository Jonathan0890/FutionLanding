const express = require('express');
const router = express.Router();
const contactoController = require('../controllers/contactoController');
const verifyToken = require('../middleware/auth');

// Crear un nuevo contacto
router.post('/', contactoController.crearContacto);

// Obtener todos los contactos (para administración)
router.get('/', contactoController.obtenerContactos);

// Cambiar estado del lead (protegido)
router.put('/:id', verifyToken, contactoController.actualizarEstado);

module.exports = router;