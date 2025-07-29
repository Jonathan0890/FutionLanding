const Hero = () => {
    return (
        <section
            id="inicio"
            className="min-h-screen flex items-center bg-gradient-to-r from-[#2f2e41] to-[#6c63ff] text-white pt-20"
            style={{
                backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), url('/images/hero-bg.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center"
            }}
        >
            <div className="container mx-auto px-4 text-center">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">Diseño que inspira y conecta</h1>
                <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                    Transformamos tus ideas en experiencias visuales impactantes
                </p>
                <a
                    href="#contacto"
                    className="bg-white text-[#6c63ff] px-8 py-3 rounded-md font-semibold hover:bg-opacity-90 transition inline-block"
                >
                    Contáctanos
                </a>
            </div>
        </section>
    );
};

export default Hero;