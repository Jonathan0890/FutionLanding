import { FaTachometerAlt, FaEnvelope, FaBriefcase, FaUsers, FaChartLine, FaCog } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user')) || {};

    const menuItems = [
        { path: "/dashboard", icon: <FaTachometerAlt />, label: "Dashboard" },
        { path: "#", icon: <FaEnvelope />, label: "Mensajes" },
        { path: "#", icon: <FaBriefcase />, label: "Proyectos" },
        { path: "#", icon: <FaUsers />, label: "Clientes" },
        { path: "#", icon: <FaChartLine />, label: "Estadísticas" },
        { path: "#", icon: <FaCog />, label: "Configuración" }
    ];

    return (
        <aside className="bg-[#f8f9fa] rounded-lg shadow p-6 h-fit">
            <div className="flex items-center mb-6 pb-6 border-b border-[#e0e0e0]">
                <div className="w-16 h-16 rounded-full bg-[#3498db] text-white flex items-center justify-center text-2xl font-bold mr-4">
                    {user.name?.charAt(0) || 'C'}
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-[#2c3e50]">{user.name || 'Creativa Studio'}</h2>
                    <p className="text-[#7f8c8d] text-sm">{user.email || 'admin@creativastudio.com'}</p>
                </div>
            </div>

            <ul className="space-y-2">
                {menuItems.map((item, index) => (
                    <li key={index}>
                        <a
                            href={item.path}
                            className={`flex items-center px-4 py-3 rounded-md transition-colors ${location.pathname === item.path
                                    ? 'bg-[#3498db] text-white'
                                    : 'text-[#2c3e50] hover:bg-[#f1f1f1]'
                                }`}
                        >
                            <span className="mr-3">{item.icon}</span>
                            {item.label}
                        </a>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default Sidebar;