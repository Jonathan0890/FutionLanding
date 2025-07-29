const mongoose = require('mongoose');

const contactoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingresa un email válido']
    },
    telefono: {
        type: String,
        trim: true
    },
    mensaje: {
        type: String,
        required: true,
        trim: true
    },
    estado: {
        type: String,
        enum: ['nuevo', 'contactado', 'descartado'],
        default: 'nuevo'
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Contacto', contactoSchema);
