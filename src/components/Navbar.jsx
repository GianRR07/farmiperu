import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Aquí manejar la búsqueda
      setSearchTerm("");
      setIsOpen(false);
    }
  };

  return (
    <nav
      className="fixed w-full top-0 left-0 z-50 shadow-md"
      style={{ backgroundColor: "#e73535ff" }}
    >
      {/* Parte superior: logo, búsqueda, carrito e iniciar sesión */}
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center w-full">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center text-white font-bold text-xl select-none cursor-pointer"
          onClick={() => setIsOpen(false)}
        >
          <img
            src="/public/images/logo2.png"
            alt="Logo Farmacias Perú"
            className="h-8 w-8 mr-2 object-contain"
          />
          FARMACIAS PERÚ
        </Link>

        {/* Barra de búsqueda */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-grow max-w-md mx-6"
          role="search"
        >
          <input
            type="text"
            placeholder="Buscar productos ..."
            className="flex-grow px-4 py-2 border border-white rounded-l-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 text-[#e32c2c] bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="bg-white text-[#e32c2c] px-4 py-2 rounded-r-md hover:bg-red-100 transition-colors"
            aria-label="Buscar"
          >
            🔍
          </button>
        </form>

        {/* Carrito + Iniciar Sesión */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/carrito"
            className="flex items-center text-white hover:text-red-200"
            onClick={() => setIsOpen(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="white"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
              className="h-6 w-6 mr-2"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.95-1.55L23 6H6" />
            </svg>
            Carrito
          </Link>

          <Link
            to="/login"
            className="bg-white text-[#e73535] font-semibold px-4 py-2 rounded-md hover:bg-red-100 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Iniciar Sesión
          </Link>
        </div>

        {/* Botón hamburguesa (móvil) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white focus:outline-none z-50"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Menú de navegación principal (visible en md+ o desplegable en móvil) */}
      <ul
        className={`flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-40 w-full bg-[#e32c2c] md:bg-transparent md:static absolute left-0 md:opacity-100 transition-all duration-300 ease-in ${
          isOpen
            ? "top-full opacity-100 shadow-md border-t border-[#a52a2a]"
            : "top-[-490px] opacity-0 pointer-events-none"
        } md:relative md:top-0 md:opacity-100 md:pointer-events-auto px-6 md:px-0 py-4 md:py-0 z-40`}
      >
        <li>
          <Link
            to="/"
            className="block px-6 py-3 text-white hover:text-[#ff7777] font-medium"
            onClick={() => setIsOpen(false)}
          >
            Inicio
          </Link>
        </li>
        <li>
          <Link
            to="/quienes-somos"
            className="block px-6 py-3 text-white hover:text-[#ff7777] font-medium"
            onClick={() => setIsOpen(false)}
          >
            Quienes Somos
          </Link>
        </li>
        <li>
          <Link
            to="/productos"
            className="block px-6 py-3 text-white hover:text-[#ff7777] font-medium"
            onClick={() => setIsOpen(false)}
          >
            Productos
          </Link>
        </li>
        <li>
          <Link
            to="/contacto"
            className="block px-6 py-3 text-white hover:text-[#ff7777] font-medium"
            onClick={() => setIsOpen(false)}
          >
            Contacto
          </Link>
        </li>

        {/* En móvil también mostramos carrito e iniciar sesión aquí */}
        <li className="md:hidden">
          <Link
            to="/carrito"
            className="block px-6 py-3 text-white hover:text-[#ff7777] font-medium"
            onClick={() => setIsOpen(false)}
          >
            Carrito de Compras
          </Link>
        </li>
        <li className="md:hidden">
          <Link
            to="/login"
            className="block px-6 py-3 text-white hover:text-[#ff7777] font-medium"
            onClick={() => setIsOpen(false)}
          >
            Inicio de Sesión
          </Link>
        </li>
      </ul>
    </nav>
  );
}
