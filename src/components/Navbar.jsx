import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useLocation } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [rolUsuario, setRolUsuario] = useState(null);
  const { items, removeItem, totalPrice, totalItems, clearCart } = useCart();
  const [showPay, setShowPay] = useState(false);

  // Si tus precios están en soles, convertimos a USD para sandbox (tasa demo)
  const PEN_TO_USD = 0.27; // ajusta si quieres
  const totalUSD = (Number(totalPrice) * PEN_TO_USD).toFixed(2);

  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
    setSidebarOpen(false);
    setShowPay(false);
  }, [location]);

  useEffect(() => {
    const checkLogin = () => {
      const nombreUsuario = localStorage.getItem("nombreUsuario");
      const rol = localStorage.getItem("rolUsuario");

      setIsLoggedIn(!!nombreUsuario);
      setRolUsuario(rol);
    };

    checkLogin();

    window.addEventListener("storage", checkLogin);
    window.addEventListener("loginStateChanged", checkLogin);

    return () => {
      window.removeEventListener("storage", checkLogin);
      window.removeEventListener("loginStateChanged", checkLogin);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchTerm("");
      setIsOpen(false);
    }
  };

  const toggleSidebar = () => {
    const next = !sidebarOpen;
    setSidebarOpen(next);
    if (!next) setShowPay(false);
  };

  return (
    <>
      <nav
        className="fixed w-full top-0 left-0 z-50 shadow-md"
        style={{ backgroundColor: "#e73535ff" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center w-full">
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
              Carrito ({totalItems})
            </button>

            {isLoggedIn ? (
              <Link
                to={rolUsuario === "admin" ? "/admin" : "/cliente"}
                className="bg-white text-[#e73535] font-semibold px-4 py-2 rounded-md hover:bg-red-100 transition-colors"
                onClick={() => setIsOpen(false)} // <-- AÑADE ESTA LÍNEA AQUÍ
              >
                Mi Perfil
              </Link>
            ) : (
              <Link
                to="/login"
                className="bg-white text-[#e73535] font-semibold px-4 py-2 rounded-md hover:bg-red-100 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Iniciar Sesión
              </Link>
            )}
          </div>

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
              <span className="text-sm">({totalItems})</span>
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
              to={
                isLoggedIn
                  ? rolUsuario === "admin"
                    ? "/admin"
                    : "/cliente"
                  : "/login"
              }
              className="block px-6 py-3 text-white hover:text-[#ff7777] font-medium"
              onClick={() => setIsOpen(false)}
            >
              {isLoggedIn ? "Mi Perfil" : "Iniciar Sesión"}
            </Link>
          </li>
        </ul>
      </nav>

      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg border-l-4 border-red-600 transform transition-transform duration-300 z-50 flex flex-col ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
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
          {items.length === 0 ? (
            <p className="text-gray-500">El carrito está vacío.</p>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2"
              >
                <div>
                  <p className="font-semibold text-gray-800">{item.nombre}</p>
                  <p className="text-sm text-gray-600">
                    {item.qty} x S/.{Number(item.precio).toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-600 hover:text-red-800 font-bold text-lg focus:outline-none"
                  aria-label={`Eliminar ${item.nombre}`}
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-red-50 border-t border-red-600">
          <div className="flex justify-between items-center font-semibold text-red-700 text-lg">
            <span>Total:</span>
            <span>S/.{totalPrice.toFixed(2)}</span>
          </div>
          <button
            disabled={items.length === 0}
            onClick={() => setShowPay(true)}
            className={`mt-3 w-full py-2 rounded-md font-semibold text-white transition-colors ${
              items.length === 0
                ? "bg-red-300 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            Finalizar compra
          </button>
          {showPay && items.length > 0 && (
            <div className="mt-4">
              <div className="text-sm text-gray-600 mb-2">
                Monto a pagar (USD – sandbox): <strong>${totalUSD}</strong>
              </div>
              <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: { value: totalUSD },
                        description: "Compra en Farmacias Perú (modo prueba)",
                      },
                    ],
                  });
                }}
                onApprove={async (data, actions) => {
                  const details = await actions.order.capture();
                  alert(`✅ Pago aprobado: ${details.id}`);
                  clearCart();
                  setShowPay(false);
                  setSidebarOpen(false);
                }}
                onCancel={() => {
                  alert("⚠️ Pago cancelado por el usuario");
                  setShowPay(false);
                }}
                onError={(err) => {
                  console.error(err);
                  alert("❌ Ocurrió un error durante el pago");
                  setShowPay(false);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
