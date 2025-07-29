const Portfolio = () => {
    const portfolioItems = [
        {
            id: 1,
            title: "Branding Café",
            image: "/images/project1.jpg"
        },
        {
            id: 2,
            title: "App Financiera",
            image: "/images/project2.jpg"
        },
        {
            id: 3,
            title: "E-commerce",
            image: "/images/project3.jpg"
        }
    ];

    return (
        <section id="portafolio" className="py-20">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Nuestro Trabajo</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {portfolioItems.map(item => (
                        <div
                            key={item.id}
                            className="portfolio-item relative overflow-hidden rounded-lg h-64 group"
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="overlay absolute inset-0 bg-[#6c63ff] bg-opacity-80 flex items-center justify-center">
                                <h3 className="text-white text-2xl font-bold">{item.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Portfolio;