import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [cartItems, setCartItems] = useState([]); // Vacío

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchTerm("");
      setIsOpen(false);
    }
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <>
      <nav
        className="fixed w-full top-0 left-0 z-50 shadow-md"
        style={{ backgroundColor: "#e73535ff" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center w-full">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center text-white font-bold text-xl select-none cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            <img
              src="/images/logo2.png"
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

          {/* Botones y carrito desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center text-white hover:text-red-200 focus:outline-none"
              aria-label="Abrir carrito"
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
              Carrito ({cartItems.length})
            </button>

            <Link
              to="/login"
              className="bg-white text-[#e73535] font-semibold px-4 py-2 rounded-md hover:bg-red-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Iniciar Sesión
            </Link>
          </div>

          {/* Botones móviles: carrito a la izquierda del burger */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center text-white hover:text-red-200 focus:outline-none"
              aria-label="Abrir carrito"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="white"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
                className="h-6 w-6 mr-1"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.95-1.55L23 6H6" />
              </svg>
              <span className="text-sm">({cartItems.length})</span>
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none z-50"
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
        </div>

        {/* Menú navegación principal */}
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

      {/* Sidebar carrito */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-300">
          <h2 className="text-xl font-semibold text-[#e73535]">
            Carrito de Compras
          </h2>
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Cerrar carrito"
            className="text-gray-600 hover:text-[#e73535] focus:outline-none"
          >
            ✖️
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex flex-col h-[calc(100%-64px)]">
          {cartItems.length === 0 ? (
            <p className="text-gray-600">No hay productos en el carrito.</p>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2"
              >
                <div>
                  <h3 className="font-semibold text-[#e73535]">{item.name}</h3>
                  <p>
                    Cantidad: {item.quantity} x S/ {item.price.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700 focus:outline-none"
                  aria-label={`Eliminar ${item.name}`}
                >
                  🗑️
                </button>
              </div>
            ))
          )}

          {cartItems.length > 0 && (
            <div className="mt-auto pt-4 border-t border-gray-300">
              <p className="font-semibold text-right text-lg">
                Total: S/ {totalPrice.toFixed(2)}
              </p>
              <button
                onClick={() => alert("Ir a pagar...")}
                className="w-full bg-[#e73535] text-white py-2 rounded-md mt-2 hover:bg-red-600 transition-colors"
              >
                Pagar
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
