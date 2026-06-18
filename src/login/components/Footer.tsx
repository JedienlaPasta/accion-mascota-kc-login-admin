const Footer = () => {
    return (
        <div className="relative  py-6 text-gray-600">
            <div className="mx-auto flex flex-col items-center justify-center gap-6 px-6 md:flex-row">
                <div className="flex flex-col items-center gap-3 md:flex-row md:gap-6">
                    <img
                        src="/escudo.png"
                        alt="Municipalidad Algarrobo"
                        width={200}
                        height={40}
                        className="w-32 object-cover opacity-80"
                    />
                    <span className="hidden h-10 w-px bg-gray-400 md:block"></span>
                    <p className="text-sm">2026 © Ilustre Municipalidad de Algarrobo</p>
                </div>
            </div>
        </div>
    );
};

export default Footer;
