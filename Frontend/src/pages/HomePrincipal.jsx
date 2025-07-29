import { useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Portfolio from '../components/Portafolio';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const HomePrincipal = () => {
    useEffect(() => {
        // Smooth scroll para anclas
        const handleAnchorClick = (e) => {
            const targetId = e.target.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        };

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', handleAnchorClick);
        });

        return () => {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.removeEventListener('click', handleAnchorClick);
            });
        };
    }, []);

    return (
        <div className="font-poppins">
            <Header />
            <main>
                <Hero />
                <Services />
                <Portfolio />
                <Contact />
            </main>
            <Footer />
        </div>
    );
};

export default HomePrincipal;