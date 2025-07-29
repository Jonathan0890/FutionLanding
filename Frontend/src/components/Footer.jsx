const Footer = () => {
    return (
        <footer className="bg-[#2f2e41] text-white py-8">
            <div className="container mx-auto px-4 text-center">
                <p>&copy; {new Date().getFullYear()} CreativaStudio. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
};

export default Footer;