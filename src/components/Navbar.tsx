import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-md py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container-custom flex justify-between items-center">
        <a
          href="#"
          className="flex items-center gap-2"
        >
          <img 
            src="../images/logo-tbc.svg" 
            alt="The Beauty Club Logo" 
            className={`h-10 ${scrolled ? 'filter-none' : 'brightness-0 invert'}`} 
          />
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#about" className={`${scrolled ? 'text-gray-700 hover:text-purple-600' : 'text-white/90 hover:text-white'}`}>
            Nossa História
          </a>
          <a href="#benefits" className={`${scrolled ? 'text-gray-700 hover:text-purple-600' : 'text-white/90 hover:text-white'}`}>
            Benefícios
          </a>
          <a href="#testimonials" className={`${scrolled ? 'text-gray-700 hover:text-purple-600' : 'text-white/90 hover:text-white'}`}>
            Depoimentos
          </a>
          <a href="#join" className="btn btn-primary">
            Quero ser sócia
          </a>
        </div>

        {/* Mobile Navigation Toggle */}
        <button
          className={`md:hidden ${scrolled ? 'text-gray-700' : 'text-white'}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg py-4 px-4 absolute top-full left-0 right-0">
          <div className="flex flex-col gap-4">
            <a
              href="#about"
              className="text-gray-700 hover:text-purple-600 py-2"
              onClick={() => setIsOpen(false)}
            >
              Nossa História
            </a>
            <a
              href="#benefits"
              className="text-gray-700 hover:text-purple-600 py-2"
              onClick={() => setIsOpen(false)}
            >
              Benefícios
            </a>
            <a
              href="#testimonials"
              className="text-gray-700 hover:text-purple-600 py-2"
              onClick={() => setIsOpen(false)}
            >
              Depoimentos
            </a>
            <a
              href="#join"
              className="btn btn-primary w-full justify-center"
              onClick={() => setIsOpen(false)}
            >
              Quero ser sócia
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;