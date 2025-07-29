const Contacto = require('../models/Contacto');
const axios = require('axios');
exports.crearContacto = async (req, res) => {
    try {
        const recaptchaResponse = req.body['g-recaptcha-response'];
        if (!recaptchaResponse) {
            return res.status(400).json({ message: 'reCAPTCHA no proporcionado' });
        }

        const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${recaptchaResponse}`;
        const recaptchaResult = await axios.post(verificationUrl);

        if (!recaptchaResult.data.success) {
            return res.status(400).json({ message: 'reCAPTCHA inválido' });
        }

        const nuevoContacto = new Contacto(req.body);
        await nuevoContacto.save();

        // Enviar notificación a Slack
        const slackWebhook = process.env.SLACK_WEBHOOK_URL;
        const slackMessage = {
            text: `📥 Nuevo mensaje de contacto:\n*Nombre:* ${nuevoContacto.nombre}\n*Email:* ${nuevoContacto.email}\n*Teléfono:* ${nuevoContacto.telefono || 'N/A'}\n*Mensaje:* ${nuevoContacto.mensaje}`
        };

        if (slackWebhook) {
            try {
                await axios.post(slackWebhook, slackMessage);
            } catch (slackError) {
                console.error('Error al enviar mensaje a Slack:', slackError.message);
                // No detenemos la respuesta al cliente aunque falle Slack
            }
        }

        res.status(201).json({
            message: 'Mensaje enviado con éxito',
            contacto: nuevoContacto
        });

    } catch (error) {
        console.error('Error al guardar el contacto:', error);
        res.status(400).json({
            message: 'Error al procesar el mensaje',
            error: error.message
        });
    }
};

exports.obtenerContactos = async (req, res) => {
    try {
        const contactos = await Contacto.find().sort({ fecha: -1 });
        res.status(200).json(contactos);
    } catch (error) {
        console.error('Error al obtener contactos:', error);
        res.status(500).json({
            message: 'Error al obtener los mensajes',
            error: error.message
        });
    }
};

// Actualizar estado del contacto desde el dashboard (nuevo, contactado, descartado)
exports.actualizarEstado = async (req, res) => {
    try {
        const { estado } = req.body;
        const { id } = req.params;

        const contactoActualizado = await Contacto.findByIdAndUpdate(
            id,
            { estado },
            { new: true }
        );

        if (!contactoActualizado) {
            return res.status(404).json({ message: 'Contacto no encontrado' });
        }

        res.status(200).json({
            message: 'Estado actualizado correctamente',
            contacto: contactoActualizado
        });
    } catch (error) {
        console.error('Error al actualizar el estado:', error);
        res.status(500).json({
            message: 'Error al actualizar el estado',
            error: error.message
        });
    }
};
