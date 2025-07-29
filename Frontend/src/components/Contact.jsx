import { useState, useRef } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaExternalLinkAlt, FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import ReCAPTCHA from 'react-google-recaptcha';

const Contact = () => {
    // Configuración de reCAPTCHA
    const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
    
    // Estados del formulario
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        mensaje: '',
        aceptaTerminos: false
    });
    
    // Estados para manejo de errores
    const [errors, setErrors] = useState({
        nombre: '',
        email: '',
        telefono: '',
        mensaje: '',
        aceptaTerminos: '',
        recaptcha: ''
    });
    
    // Estados para feedback al usuario
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const recaptchaRef = useRef(null);
    const [recaptchaToken, setRecaptchaToken] = useState('');

    // Sanitizar inputs
    const sanitizeInput = (input) => {
        if (!input) return input;
        return input.toString()
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    };

    // Validar email
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    // Validar teléfono
    const validatePhone = (phone) => {
        if (!phone) return true; // Opcional
        const re = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
        return re.test(phone);
    };

    // Manejar cambios en los inputs
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        const sanitizedValue = type === 'checkbox' ? checked : sanitizeInput(value);
        
        setFormData(prev => ({
            ...prev,
            [name]: sanitizedValue
        }));

        // Limpiar error al escribir
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Validar formulario
    const validateForm = () => {
        let valid = true;
        const newErrors = {
            nombre: '',
            email: '',
            telefono: '',
            mensaje: '',
            aceptaTerminos: '',
            recaptcha: ''
        };

        // Validar nombre
        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido';
            valid = false;
        } else if (formData.nombre.trim().length < 2) {
            newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
            valid = false;
        }

        // Validar email
        if (!formData.email.trim()) {
            newErrors.email = 'El email es requerido';
            valid = false;
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Ingresa un email válido';
            valid = false;
        }

        // Validar teléfono
        if (formData.telefono && !validatePhone(formData.telefono)) {
            newErrors.telefono = 'Ingresa un teléfono válido';
            valid = false;
        }

        // Validar mensaje
        if (!formData.mensaje.trim()) {
            newErrors.mensaje = 'El mensaje es requerido';
            valid = false;
        } else if (formData.mensaje.trim().length < 10) {
            newErrors.mensaje = 'El mensaje debe tener al menos 10 caracteres';
            valid = false;
        }

        // Validar términos
        if (!formData.aceptaTerminos) {
            newErrors.aceptaTerminos = 'Debes aceptar los términos';
            valid = false;
        }

        // Validar reCAPTCHA
        if (!recaptchaToken) {
            newErrors.recaptcha = 'Por favor verifica que no eres un robot';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    // Manejar envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ text: '', type: '' });

        // Validar formulario
        if (!validateForm()) {
            setIsSubmitting(false);
            return;
        }

        try {
            // Datos a enviar
            const payload = {
                nombre: formData.nombre,
                email: formData.email,
                telefono: formData.telefono || null,
                mensaje: formData.mensaje,
                'g-recaptcha-response': recaptchaToken // Nombre que espera el backend
            };

            // Enviar datos al backend
            const response = await fetch(import.meta.env.VITE_API_BASE_URL + '/api/contacto', {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });


            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al enviar el mensaje');
            }

            // Mensaje de éxito
            setMessage({
                text: '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.',
                type: 'success'
            });

            // Resetear formulario
            setFormData({
                nombre: '',
                email: '',
                telefono: '',
                mensaje: '',
                aceptaTerminos: false
            });

            // Resetear reCAPTCHA
            recaptchaRef.current.reset();
            setRecaptchaToken('');
            
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            setMessage({
                text: error.message || 'Error al enviar el mensaje. Por favor, inténtalo nuevamente.',
                type: 'error'
            });
            
            // Forzar nuevo desafío reCAPTCHA en caso de error
            if (recaptchaRef.current) {
                recaptchaRef.current.reset();
            }
            setRecaptchaToken('');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contacto" className="py-20 bg-[#f8f9fa]">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Contáctanos</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {/* Sección de Información */}
                    <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg h-fit">
                        <h3 className="text-2xl font-semibold text-[#6c63ff] mb-6">Información de Contacto</h3>

                        <div className="space-y-5">
                            <div className="flex items-start">
                                <FaMapMarkerAlt className="text-[#6c63ff] mt-1 mr-3 flex-shrink-0" />
                                <div>
                                    <h4 className="font-medium text-[#2f2e41]">Dirección</h4>
                                    <p className="text-[#6c757d]">Av. Principal 123, Ciudad</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <FaPhone className="text-[#6c63ff] mt-1 mr-3 flex-shrink-0" />
                                <div>
                                    <h4 className="font-medium text-[#2f2e41]">Teléfono</h4>
                                    <p className="text-[#6c757d]">+1 234 567 890</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <FaEnvelope className="text-[#6c63ff] mt-1 mr-3 flex-shrink-0" />
                                <div>
                                    <h4 className="font-medium text-[#2f2e41]">Email</h4>
                                    <p className="text-[#6c757d]">hola@creativastudio.com</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h4 className="font-medium text-[#2f2e41] mb-3">Horario de atención</h4>
                            <p className="text-[#6c757d]">Lunes a Viernes: 9:00 - 18:00</p>
                            <p className="text-[#6c757d]">Sábados: 10:00 - 14:00</p>
                        </div>
                    </div>

                    {/* Formulario */}
                    <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-semibold text-[#6c63ff] mb-6">Envíanos un mensaje</h3>

                        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                            {/* Campo Nombre */}
                            <div>
                                <label htmlFor="nombre" className="block text-sm font-medium text-[#2f2e41] mb-1">
                                    Nombre completo *
                                </label>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#6c63ff] focus:border-[#6c63ff] transition ${
                                        errors.nombre ? 'border-red-500' : 'border-[#ddd]'
                                    }`}
                                    required
                                />
                                {errors.nombre && (
                                    <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
                                )}
                            </div>

                            {/* Campos Email y Teléfono */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-[#2f2e41] mb-1">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#6c63ff] focus:border-[#6c63ff] transition ${
                                            errors.email ? 'border-red-500' : 'border-[#ddd]'
                                        }`}
                                        required
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="telefono" className="block text-sm font-medium text-[#2f2e41] mb-1">
                                        Teléfono
                                    </label>
                                    <input
                                        type="tel"
                                        id="telefono"
                                        name="telefono"
                                        value={formData.telefono}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#6c63ff] focus:border-[#6c63ff] transition ${
                                            errors.telefono ? 'border-red-500' : 'border-[#ddd]'
                                        }`}
                                    />
                                    {errors.telefono && (
                                        <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>
                                    )}
                                </div>
                            </div>

                            {/* Campo Mensaje */}
                            <div>
                                <label htmlFor="mensaje" className="block text-sm font-medium text-[#2f2e41] mb-1">
                                    Mensaje *
                                </label>
                                <textarea
                                    id="mensaje"
                                    name="mensaje"
                                    value={formData.mensaje}
                                    onChange={handleChange}
                                    rows="5"
                                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#6c63ff] focus:border-[#6c63ff] transition ${
                                        errors.mensaje ? 'border-red-500' : 'border-[#ddd]'
                                    }`}
                                    required
                                ></textarea>
                                {errors.mensaje && (
                                    <p className="mt-1 text-sm text-red-600">{errors.mensaje}</p>
                                )}
                            </div>

                            {/* reCAPTCHA */}
                            <div>
                                <ReCAPTCHA
                                    ref={recaptchaRef}
                                    sitekey={RECAPTCHA_SITE_KEY}
                                    onChange={(token) => {
                                        setRecaptchaToken(token);
                                        setErrors(prev => ({...prev, recaptcha: ''}));
                                    }}
                                    onErrored={() => {
                                        setRecaptchaToken('');
                                        setErrors(prev => ({...prev, recaptcha: "Error al verificar reCAPTCHA"}));
                                    }}
                                    onExpired={() => {
                                        setRecaptchaToken('');
                                        setErrors(prev => ({...prev, recaptcha: "reCAPTCHA expirado"}));
                                    }}
                                />
                                {errors.recaptcha && (
                                    <p className="mt-1 text-sm text-red-600">{errors.recaptcha}</p>
                                )}
                            </div>

                            {/* Términos y condiciones */}
                            <div className="flex items-start">
                                <div className="flex items-center h-5 mt-0.5">
                                    <input
                                        id="aceptaTerminos"
                                        name="aceptaTerminos"
                                        type="checkbox"
                                        checked={formData.aceptaTerminos}
                                        onChange={handleChange}
                                        className={`h-4 w-4 text-[#6c63ff] focus:ring-[#6c63ff] rounded ${
                                            errors.aceptaTerminos ? 'border-red-500' : 'border-[#ddd]'
                                        }`}
                                        required
                                    />
                                </div>
                                <label htmlFor="aceptaTerminos" className="ml-3 text-sm">
                                    He leído y acepto los{' '}
                                    <a
                                        href="/terminos-condiciones"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#6c63ff] hover:underline inline-flex items-center"
                                    >
                                        términos y condiciones <FaExternalLinkAlt className="ml-1 text-xs" />
                                    </a> *
                                </label>
                            </div>
                            {errors.aceptaTerminos && (
                                <p className="mt-1 text-sm text-red-600">{errors.aceptaTerminos}</p>
                            )}

                            {/* Botón de envío */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-3 px-6 rounded-md font-semibold text-white transition-colors flex items-center justify-center ${
                                    isSubmitting
                                        ? 'bg-[#6c63ff]/70 cursor-not-allowed'
                                        : 'bg-[#6c63ff] hover:bg-[#4d44db]'
                                }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <FaSpinner className="animate-spin mr-2" />
                                        Enviando...
                                    </>
                                ) : 'Enviar Mensaje'}
                            </button>

                            {/* Mensajes de feedback */}
                            {message.text && (
                                <div
                                    className={`p-3 rounded-md flex items-start ${
                                        message.type === 'success'
                                            ? 'bg-green-50 text-green-700'
                                            : 'bg-red-50 text-red-700'
                                    }`}
                                >
                                    {message.type === 'success' ? (
                                        <FaCheckCircle className="mt-0.5 mr-2 flex-shrink-0" />
                                    ) : (
                                        <FaTimesCircle className="mt-0.5 mr-2 flex-shrink-0" />
                                    )}
                                    <span>{message.text}</span>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;