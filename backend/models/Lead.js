const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true },
  telefono: { type: String },
  mensaje: { type: String, required: true },
  estado: { type: String, default: 'nuevo', enum: ['nuevo', 'contactado', 'descartado'] },
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lead', leadSchema);
