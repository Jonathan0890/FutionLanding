import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import DashboardHeader from '../components/DashboardHeader';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StartCard';
import Footer from '../components/Footer';
import {
    FaEnvelopeOpenText,
    FaCheckCircle,
    FaUser,
    FaEnvelope,
    FaSearch,
    FaPhone,
    FaCalendarAlt,
    FaTrash,
    FaEdit,
    FaFilter,
    FaPlus,
    FaFileExport
} from 'react-icons/fa';
import { FiRefreshCw } from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
    const [contacts, setContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('todos');
    const [dateFilter, setDateFilter] = useState('todos');
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        nuevos: 0,
        contactados: 0,
        descartados: 0,
        total: 0
    });
    const [selectedContacts, setSelectedContacts] = useState([]);
    const navigate = useNavigate();

    // Obtener contactos del API
    const fetchContacts = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(import.meta.env.VITE_API_BASE_URL + '/api/contacto');
            if (!response.ok) throw new Error('Error al cargar contactos');

            const data = await response.json();
            setContacts(data);
            updateStats(data);
            applyFilters(data, searchTerm, statusFilter, dateFilter);
            toast.success('Contactos actualizados');
        } catch (error) {
            console.error("Error:", error);
            toast.error(error.message);
            // Cargar datos de ejemplo si el API falla (solo para desarrollo)
            if (process.env.NODE_ENV === 'development') {
                const sampleData = getSampleContacts();
                setContacts(sampleData);
                updateStats(sampleData);
                applyFilters(sampleData, searchTerm, statusFilter, dateFilter);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Datos de ejemplo para desarrollo
    const getSampleContacts = () => {
        return [
            {
                _id: '1',
                nombre: "Ana López",
                email: "ana@ejemplo.com",
                telefono: "555-1234",
                mensaje: "Interesado en diseño de logo",
                fecha: new Date().toISOString(),
                estado: "nuevo"
            },
            {
                _id: '2',
                nombre: "Carlos Méndez",
                email: "carlos@empresa.com",
                telefono: "555-5678",
                mensaje: "Cotización para sitio web",
                fecha: new Date(Date.now() - 86400000).toISOString(),
                estado: "contactado"
            },
            {
                _id: '3',
                nombre: "María González",
                email: "maria@tienda.com",
                telefono: "555-9012",
                mensaje: "Diseño de catálogo digital",
                fecha: new Date(Date.now() - 172800000).toISOString(),
                estado: "nuevo"
            },
            {
                _id: '4',
                nombre: "Juan Pérez",
                email: "juan@servicios.com",
                telefono: "555-3456",
                mensaje: "Rediseño de identidad corporativa",
                fecha: new Date(Date.now() - 259200000).toISOString(),
                estado: "contactado"
            }
        ];
    };

    // Actualizar estadísticas
    const updateStats = (contactsData) => {
        setStats({
            nuevos: contactsData.filter(c => c.estado === 'nuevo').length,
            contactados: contactsData.filter(c => c.estado === 'contactado').length,
            descartados: contactsData.filter(c => c.estado === 'descartado').length,
            total: contactsData.length
        });
    };

    // Aplicar filtros
    const applyFilters = (contactsData, searchTerm, status, dateRange) => {
        let filtered = [...contactsData];

        // Filtro de búsqueda
        if (searchTerm) {
            filtered = filtered.filter(contact =>
                Object.values(contact).some(
                    value => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }

        // Filtro por estado
        if (status !== 'todos') {
            filtered = filtered.filter(contact => contact.estado === status);
        }

        // Filtro por fecha
        if (dateRange !== 'todos') {
            const today = new Date();
            const cutoffDate = new Date(today);

            switch (dateRange) {
                case 'hoy':
                    cutoffDate.setHours(0, 0, 0, 0);
                    break;
                case 'semana':
                    cutoffDate.setDate(today.getDate() - 7);
                    break;
                case 'mes':
                    cutoffDate.setMonth(today.getMonth() - 1);
                    break;
                default:
                    break;
            }

            filtered = filtered.filter(contact =>
                new Date(contact.fecha) >= cutoffDate
            );
        }

        setFilteredContacts(filtered);
    };

    // Cambiar estado de contacto
    const handleStatusChange = async (id, newStatus) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/contacto/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ estado: newStatus }),
            });

            if (!response.ok) throw new Error('Error al actualizar estado');

            const updatedContacts = contacts.map(contact =>
                contact._id === id ? { ...contact, estado: newStatus } : contact
            );

            setContacts(updatedContacts);
            updateStats(updatedContacts);
            toast.success('Estado actualizado');

        } catch (error) {
            console.error("Error:", error);
            toast.error(error.message);
        }
    };

    // Eliminar contacto
    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este contacto?')) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/contacto/${id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) throw new Error('Error al eliminar contacto');

                const updatedContacts = contacts.filter(contact => contact._id !== id);
                setContacts(updatedContacts);
                updateStats(updatedContacts);
                toast.success('Contacto eliminado');

            } catch (error) {
                console.error("Error:", error);
                toast.error(error.message);
            }
        }
    };

    // Eliminar múltiples contactos
    const handleBulkDelete = async () => {
        if (selectedContacts.length === 0) {
            toast.warning('No hay contactos seleccionados');
            return;
        }

        if (window.confirm(`¿Eliminar ${selectedContacts.length} contactos seleccionados?`)) {
            try {
                const response = await fetch(import.meta.env.VITE_API_BASE_URL + '/api/contacto/bulk', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ids: selectedContacts }),
                });

                if (!response.ok) throw new Error('Error al eliminar contactos');

                const updatedContacts = contacts.filter(
                    contact => !selectedContacts.includes(contact._id)
                );

                setContacts(updatedContacts);
                setSelectedContacts([]);
                updateStats(updatedContacts);
                toast.success(`${selectedContacts.length} contactos eliminados`);

            } catch (error) {
                console.error("Error:", error);
                toast.error(error.message);
            }
        }
    };

    // Exportar a CSV
    const handleExport = () => {
        const headers = ['Nombre', 'Email', 'Teléfono', 'Mensaje', 'Fecha', 'Estado'];
        const csvContent = [
            headers.join(','),
            ...filteredContacts.map(contact =>
                [
                    `"${contact.nombre}"`,
                    contact.email,
                    contact.telefono || '',
                    `"${contact.mensaje.replace(/"/g, '""')}"`,
                    new Date(contact.fecha).toLocaleDateString(),
                    contact.estado
                ].join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `contactos_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success('Exportación completada');
    };

    // Seleccionar/deseleccionar contacto
    const toggleSelectContact = (id) => {
        setSelectedContacts(prev =>
            prev.includes(id)
                ? prev.filter(contactId => contactId !== id)
                : [...prev, id]
        );
    };

    // Seleccionar/deseleccionar todos
    const toggleSelectAll = () => {
        if (selectedContacts.length === filteredContacts.length) {
            setSelectedContacts([]);
        } else {
            setSelectedContacts(filteredContacts.map(contact => contact._id));
        }
    };

    // Formatear fecha
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Efectos
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user?.isAuthenticated) {
            navigate('/login');
            return;
        }

        fetchContacts();
    }, [navigate]);

    useEffect(() => {
        applyFilters(contacts, searchTerm, statusFilter, dateFilter);
    }, [contacts, searchTerm, statusFilter, dateFilter]);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <DashboardHeader />

            <div className="flex-grow container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
                    <Sidebar />

                    <main className="bg-white rounded-xl shadow-sm overflow-hidden">
                        {/* Estadísticas */}
                        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4 border-b border-gray-200">
                            <StatCard
                                icon={<FaEnvelopeOpenText className="text-3xl text-blue-500" />}
                                title="Nuevos"
                                value={stats.nuevos}
                                color="blue"
                            />
                            <StatCard
                                icon={<FaCheckCircle className="text-3xl text-green-500" />}
                                title="Contactados"
                                value={stats.contactados}
                                color="green"
                            />
                            <StatCard
                                icon={<FaUser className="text-3xl text-red-500" />}
                                title="Descartados"
                                value={stats.descartados}
                                color="red"
                            />
                            <StatCard
                                icon={<FaEnvelope className="text-3xl text-indigo-500" />}
                                title="Total Contactos"
                                value={stats.total}
                                color="indigo"
                            />
                        </div>

                        {/* Controles */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                                    <FaEnvelope className="text-indigo-600 mr-2" />
                                    Gestión de Contactos
                                </h2>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={() => navigate('/contacto/nuevo')}
                                        className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                                    >
                                        <FaPlus className="mr-2" />
                                        Nuevo Contacto
                                    </button>
                                    <button
                                        onClick={handleExport}
                                        className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                                    >
                                        <FaFileExport className="mr-2" />
                                        Exportar
                                    </button>
                                    <button
                                        onClick={fetchContacts}
                                        className="flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                                    >
                                        <FiRefreshCw className="mr-2" />
                                        Actualizar
                                    </button>
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="relative">
                                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Buscar en contactos..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 w-full border border-gray-300 rounded-md py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="relative">
                                        <FaFilter className="absolute left-3 top-3 text-gray-400" />
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="pl-10 w-full border border-gray-300 rounded-md py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="todos">Todos los estados</option>
                                            <option value="nuevo">Nuevo</option>
                                            <option value="contactado">Contactado</option>
                                            <option value="descartado">Descartado</option>
                                        </select>
                                    </div>

                                    <div className="relative">
                                        <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                                        <select
                                            value={dateFilter}
                                            onChange={(e) => setDateFilter(e.target.value)}
                                            className="pl-10 w-full border border-gray-300 rounded-md py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="todos">Todas las fechas</option>
                                            <option value="hoy">Hoy</option>
                                            <option value="semana">Última semana</option>
                                            <option value="mes">Último mes</option>
                                        </select>
                                    </div>
                                </div>

                                {selectedContacts.length > 0 && (
                                    <button
                                        onClick={handleBulkDelete}
                                        className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                    >
                                        <FaTrash className="mr-2" />
                                        Eliminar seleccionados ({selectedContacts.length})
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Tabla de contactos */}
                        <div className="p-6">
                            {isLoading ? (
                                <div className="flex justify-center items-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                                                        onChange={toggleSelectAll}
                                                        className="rounded text-indigo-600 focus:ring-indigo-500"
                                                    />
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Nombre
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Email
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Teléfono
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Fecha
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Estado
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Acciones
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredContacts.length > 0 ? (
                                                filteredContacts.map(contact => (
                                                    <tr key={contact._id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedContacts.includes(contact._id)}
                                                                onChange={() => toggleSelectContact(contact._id)}
                                                                className="rounded text-indigo-600 focus:ring-indigo-500"
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                                                    <FaUser className="text-indigo-600" />
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {contact.nombre}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500 truncate max-w-xs">
                                                                        {contact.mensaje}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-indigo-600">
                                                                {contact.email}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-500">
                                                                {contact.telefono || 'N/A'}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-500">
                                                                {formatDate(contact.fecha)}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <select
                                                                value={contact.estado}
                                                                onChange={(e) => handleStatusChange(contact._id, e.target.value)}
                                                                className={`text-sm rounded-md px-2 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${contact.estado === 'nuevo' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                                                        contact.estado === 'contactado' ? 'bg-green-100 text-green-800 border-green-200' :
                                                                            'bg-gray-100 text-gray-800 border-gray-200'
                                                                    }`}
                                                            >
                                                                <option value="nuevo">Nuevo</option>
                                                                <option value="contactado">Contactado</option>
                                                                <option value="descartado">Descartado</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <div className="flex space-x-2">
                                                                <button
                                                                    onClick={() => navigate(`/contacto/${contact._id}`)}
                                                                    className="text-indigo-600 hover:text-indigo-900"
                                                                    title="Editar"
                                                                >
                                                                    <FaEdit />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(contact._id)}
                                                                    className="text-red-600 hover:text-red-900"
                                                                    title="Eliminar"
                                                                >
                                                                    <FaTrash />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                                                        No se encontraron contactos
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Dashboard;