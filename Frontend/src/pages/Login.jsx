import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // Usuario temporal (solo para desarrollo)
    const TEMP_USER = {
        email: 'demo@creativastudio.com',
        password: 'DemoCreativa123', // Contraseña más segura para demo
        name: 'Usuario Demo',
        role: 'editor'
    };

    useEffect(() => {
        // Redirigir si ya está autenticado
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.isAuthenticated) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Validación básica mejorada
        if (!email.trim() || !password.trim()) {
            setError('Todos los campos son requeridos');
            setIsLoading(false);
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Por favor ingresa un email válido');
            setIsLoading(false);
            return;
        }

        try {
            // Simulación de llamada API con retraso
            await new Promise(resolve => setTimeout(resolve, 800));

            // Validación de credenciales temporales
            if (email === TEMP_USER.email && password === TEMP_USER.password) {
                const userData = {
                    email: TEMP_USER.email,
                    name: TEMP_USER.name,
                    role: TEMP_USER.role,
                    isAuthenticated: true,
                    // Token temporal (en producción usar JWT real)
                    tempToken: `temp-${Math.random().toString(36).substring(2, 15)}`,
                    // Fecha de expiración (8 horas para la demo)
                    expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
                };

                // Almacenamiento seguro (en producción usar HttpOnly cookies)
                localStorage.setItem('user', JSON.stringify(userData));

                // Redirigir con estado para evitar renderizado no necesario
                navigate('/dashboard', { replace: true });
            } else {
                setError('Credenciales incorrectas. Usa demo@creativastudio.com / DemoCreativa123');
            }
        } catch (err) {
            setError('Error al iniciar sesión. Intente nuevamente.');
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <main className="flex-grow flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                    <div className="bg-gradient-to-r from-[#6c63ff] to-[#4d44db] p-6 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
                            <FaLock className="text-white text-2xl" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">Acceso Temporal</h1>
                        <p className="text-white/90 mt-1 text-sm">Usa credenciales demo para probar el sistema</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        <div className="space-y-1">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Correo electrónico
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value.trim())}
                                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6c63ff] focus:border-[#6c63ff]"
                                    placeholder="demo@creativastudio.com"
                                    autoComplete="username"
                                    required
                                />
                                <FaUser className="absolute left-3 top-3 text-gray-400" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Contraseña
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6c63ff] focus:border-[#6c63ff]"
                                    placeholder="DemoCreativa123"
                                    autoComplete="current-password"
                                    required
                                />
                                <FaLock className="absolute left-3 top-3 text-gray-400" />
                                <button
                                    type="button"
                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm flex items-start">
                                <FaTimesCircle className="flex-shrink-0 mt-0.5 mr-2" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors flex items-center justify-center ${isLoading
                                        ? 'bg-[#6c63ff]/70 cursor-not-allowed'
                                        : 'bg-[#6c63ff] hover:bg-[#4d44db] shadow-md'
                                    }`}
                            >
                                {isLoading ? (
                                    <>
                                        <FaSpinner className="animate-spin mr-2" />
                                        Verificando...
                                    </>
                                ) : (
                                    'Acceder al sistema'
                                )}
                            </button>
                        </div>

                        <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-100">
                            <p className="mb-2">Credenciales de demostración:</p>
                            <div className="bg-gray-50 p-3 rounded-md text-left">
                                <p className="font-mono text-sm break-all">
                                    <span className="font-semibold">Email:</span> demo@creativastudio.com
                                </p>
                                <p className="font-mono text-sm break-all">
                                    <span className="font-semibold">Contraseña:</span> DemoCreativa123
                                </p>
                            </div>
                            <p className="mt-3 text-xs text-gray-400">
                                Este es un acceso temporal. Configura la autenticación real para producción.
                            </p>
                        </div>
                    </form>
                </div>
            </main>

            <footer className="py-4 text-center text-xs text-gray-500">
                <p>Sistema de demostración • {new Date().getFullYear()}</p>
            </footer>
        </div>
    );
};

export default Login;