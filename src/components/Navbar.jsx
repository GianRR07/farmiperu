import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const actualizarUsuario = () => {
      const nombre = localStorage.getItem("nombreUsuario");
      const rol = localStorage.getItem("rolUsuario");

      if (nombre && rol) {
        setUsuarioLogueado({ nombre, rol });
      } else {
        setUsuarioLogueado(null);
      }
    };

    window.addEventListener("usuarioActualizado", actualizarUsuario);

    actualizarUsuario();

    const handleStorageChange = (e) => {
      if (e.key === "nombreUsuario" || e.key === "rolUsuario") {
        actualizarUsuario();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        actualizarUsuario();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("usuarioActualizado", actualizarUsuario);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchTerm("");
      setIsOpen(false);
    }
  };

  const handleMiSesion = () => {
    if (usuarioLogueado?.rol === "admin") {
      navigate("/admin");
    } else if (usuarioLogueado?.rol === "cliente") {
      navigate("/cliente");
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
              onClick={toggleSidebar}
              className="flex items-center text-white hover:text-red-200 focus:outline-none border border-transparent hover:border-red-300 rounded-md px-2"
              aria-label="Toggle carrito"
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

            {usuarioLogueado ? (
              <button
                onClick={handleMiSesion}
                className="bg-white text-[#e73535] font-semibold px-4 py-2 rounded-md hover:bg-red-100 transition-colors"
              >
                Mi Sesión
              </button>
            ) : (
              <Link
                to="/login"
                className="bg-white text-[#e73535] font-semibold px-4 py-2 rounded-md hover:bg-red-100 transition-colors"
                onClick={() => {
                  setIsOpen(false);
                  setUsuarioLogueado(null);
                }}
              >
                Iniciar Sesión
              </Link>
            )}


          </div>

          {/* Botones móviles: carrito y burger */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={toggleSidebar}
              className="flex items-center text-white hover:text-red-200 focus:outline-none border border-transparent hover:border-red-300 rounded-md px-2"
              aria-label="Toggle carrito"
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
          className={`flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-40 w-full bg-[#e32c2c] md:bg-transparent md:static absolute left-0 md:opacity-100 transition-all duration-300 ease-in ${isOpen
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
          {!usuarioLogueado ? (
            <li className="md:hidden">
              <Link
                to="/login"
                className="block px-6 py-3 text-white hover:text-[#ff7777] font-medium"
                onClick={() => setIsOpen(false)}
              >
                Inicio de Sesión
              </Link>
            </li>
          ) : (
            <li className="md:hidden">
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleMiSesion();
                }}
                className="block w-full text-left px-6 py-3 text-white hover:text-[#ff7777] font-medium"
              >
                Mi Sesión
              </button>
            </li>
          )}
        </ul>
      </nav>

      {/* Sidebar carrito */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-red-700">Carrito</h2>
          <button
            onClick={toggleSidebar}
            aria-label="Cerrar carrito"
            className="text-red-700 hover:text-red-900 font-bold text-2xl leading-none focus:outline-none"
          >
            &times;
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <p className="text-gray-500">El carrito está vacío.</p>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2"
              >
                <div>
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    {item.quantity} x S/.{item.price.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-600 hover:text-red-800 font-bold text-lg focus:outline-none"
                  aria-label={`Eliminar ${item.name}`}
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>

        {/* Total fijo abajo */}
        <div className="p-4 bg-red-50 border-t border-red-600">
          <div className="flex justify-between items-center font-semibold text-red-700 text-lg">
            <span>Total:</span>
            <span>S/.{totalPrice.toFixed(2)}</span>
          </div>
          <button
            disabled={cartItems.length === 0}
            className={`mt-3 w-full py-2 rounded-md font-semibold text-white transition-colors ${
              cartItems.length === 0
                ? "bg-red-300 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            Finalizar compra
          </button>
        </div>
      </div>
    </>
  );
}
