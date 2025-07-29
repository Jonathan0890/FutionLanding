import { FaPaintBrush, FaLaptop, FaMobileAlt } from 'react-icons/fa';

const Services = () => {
    const services = [
        {
            icon: <FaPaintBrush className="text-5xl text-[#6c63ff] mb-5" />,
            title: "Diseño de Logo",
            description: "Identidad visual única para tu marca que comunica tu esencia."
        },
        {
            icon: <FaLaptop className="text-5xl text-[#6c63ff] mb-5" />,
            title: "Diseño Web",
            description: "Sitios web atractivos, funcionales y optimizados para conversiones."
        },
        {
            icon: <FaMobileAlt className="text-5xl text-[#6c63ff] mb-5" />,
            title: "UI/UX Design",
            description: "Experiencias de usuario intuitivas y visualmente atractivas."
        }
    ];

    return (
        <section id="servicios" className="py-20 bg-[#f8f9fa]">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Nuestros Servicios</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="service-card bg-white p-8 rounded-lg shadow-md text-center transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-lg"
                        >
                            {service.icon}
                            <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                            <p className="text-[#6c757d]">{service.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;