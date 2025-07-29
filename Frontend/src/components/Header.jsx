import { useState } from 'react';
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { path: "/", name: "Inicio" },
        { path: "/#servicios", name: "Servicios" },
        { path: "/#portafolio", name: "Portafolio" },
        { path: "/#contacto", name: "Contacto" }
    ];

    return (
        <header className="bg-white shadow-md fixed w-full z-50">
            <div className="container mx-auto px-4">
                <nav className="flex justify-between items-center py-4">
                    <Link to="/" className="text-2xl font-bold text-[#6c63ff]">CreativaStudio</Link>

                    <ul className={`md:flex ${isMenuOpen ? 'flex flex-col fixed top-20 left-0 w-full h-[calc(100vh-80px)] bg-white items-center justify-center' : 'hidden'} space-y-6 md:space-y-0 md:space-x-8`}>
                        {navLinks.map((link, index) => (
                            <li key={index}>
                                <Link
                                    to={link.path}
                                    className={`hover:text-[#6c63ff] transition ${location.pathname === link.path ? 'text-[#6c63ff]' : 'text-[#2f2e41]'}`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}

                        {location.pathname === '/dashboard' ? (
                            <li>
                                <Link
                                    to="/login"
                                    className="bg-[#6c63ff] text-white px-4 py-2 rounded-md flex items-center hover:bg-[#4d44db] transition"
                                    onClick={() => {
                                        localStorage.removeItem('user');
                                        setIsMenuOpen(false);
                                    }}
                                >
                                    <FaSignOutAlt className="mr-2" /> Cerrar sesión
                                </Link>
                            </li>
                        ) : location.pathname !== '/login' && (
                            <li>
                                <Link
                                    to="/login"
                                    className="bg-[#6c63ff] text-white px-4 py-2 rounded-md flex items-center hover:bg-[#4d44db] transition"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <FaUser className="mr-2" /> Login
                                </Link>
                            </li>
                        )}
                    </ul>

                    <button
                        className="md:hidden text-[#2f2e41] text-xl"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Menú"
                    >
                        {isMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Header;