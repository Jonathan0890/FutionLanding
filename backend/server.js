require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const contactoRoutes = require('./routes/contactoRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

const whitelist = process.env.CORS_URLS.split(',').map(url => url.trim());

// Middleware
app.use(cors(
    {
        origin: function (origin, callback) {
            // permitir requests sin origin (como Postman o curl)
            if (!origin) return callback(null, true);
            if (whitelist.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error('No permitido por CORS'));
            }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }
));
app.use(bodyParser.json());

// Rutas
app.use('/api/contacto', contactoRoutes);
app.use('/api/auth', authRoutes)
app.use('/', (req, res) => res.send('API de Contacto') )

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error de conexión a MongoDB:', err));

// Iniciar servidor
const PORT = process.env.PORT || 3195;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
});