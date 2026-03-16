import { FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";

export const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-[var(--color-primary)] text-white mt-auto">
            <div className="max-w-7xl mx-auto px-6 py-10">

                <div className="grid md:grid-cols-3 gap-8">
                    <div>
                        <h2 className="text-lg font-semibold mb-3">
                            Sistema de Asistencia Inteligente
                        </h2>
                        <p className="text-sm text-white/70">
                            Plataforma desarrollada para optimizar la gestión y
                            asistencia digital con inteligencia artificial.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-medium mb-3">Enlaces</h3>
                        <ul className="space-y-2 text-sm text-white/70">
                           
                        </ul>
                    </div>
                </div>
                <div className="border-t border-white/20 mt-8 pt-6 text-center text-sm text-white/60">
                    © {year} SICT - Todos los derechos reservados.
                </div>

            </div>
        </footer>
    );
};