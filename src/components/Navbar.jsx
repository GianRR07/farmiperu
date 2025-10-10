import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]); // resultados del autocompletado
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [rolUsuario, setRolUsuario] = useState(null);
  const { items, removeItem, totalPrice, totalItems, clearCart, addItem } = useCart();
  const [showPay, setShowPay] = useState(false);
  const [guestNombre, setGuestNombre] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestTelefono, setGuestTelefono] = useState("");
  const [guestDni, setGuestDni] = useState("");
  const [productos, setProductos] = useState([]); // productos para filtrar
const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const PEN_TO_USD = 0.27;
  const totalUSD = (Number(totalPrice) * PEN_TO_USD).toFixed(2);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/productos")
      .then((res) => setProductos(res.data))
      .catch((err) => console.error("Error al obtener productos", err));
  }, []);

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

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setSearchResults([]);
      return;
    }

    const filtered = productos.filter((p) =>
      p.nombre.toLowerCase().includes(value.toLowerCase())
    );
    setSearchResults(filtered.slice(0, 6)); // máximo 6 sugerencias
  };

  const handleResultClick = (producto) => {
  setSearchTerm("");
  setSearchResults([]);
  setProductoSeleccionado(producto); // 🟢 Abre modal del producto
};


  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/productos?search=${searchTerm}`);
      setSearchTerm("");
      setSearchResults([]);
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
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center w-full relative">
          {/* LOGO */}
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

          {/* 🔍 BUSCADOR */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-grow max-w-md mx-6 relative"
          >
            <input
              type="text"
              placeholder="Buscar productos ..."
              className="flex-grow px-4 py-2 border border-white rounded-l-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 text-[#e32c2c] bg-white"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button
              type="submit"
              className="bg-white text-[#e32c2c] px-4 py-2 rounded-r-md hover:bg-red-100 transition-colors"
            >
              🔍
            </button>

            {/* 💡 AUTOCOMPLETADO */}
            {searchResults.length > 0 && (
              <ul className="absolute top-full left-0 w-full bg-white border border-gray-200 shadow-lg rounded-b-md mt-1 z-50 max-h-64 overflow-y-auto">
                {searchResults.map((producto) => (
                  <li
                    key={producto.id}
                    onClick={() => handleResultClick(producto)}
                    className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-red-50"
                  >
                    <img
                      src={producto.imagen}
                      alt={producto.nombre}
                      className="w-10 h-10 object-contain rounded"
                    />
                    <div className="flex flex-col text-left">
                      <span className="font-semibold text-gray-800">
                        {producto.nombre}
                      </span>
                      <span className="text-sm text-gray-500">
                        S/. {producto.precio}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </form>

          {/* RESTO DE TU NAVBAR (carrito, login, menú) */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleSidebar}
              className="flex items-center text-white hover:text-red-200 focus:outline-none border border-transparent hover:border-red-300 rounded-md px-2"
            >
              🛒 Carrito ({totalItems})
            </button>

            {isLoggedIn ? (
              <Link
                to={rolUsuario === "admin" ? "/admin" : "/cliente"}
                className="bg-white text-[#e73535] font-semibold px-4 py-2 rounded-md hover:bg-red-100 transition-colors"
              >
                Mi Perfil
              </Link>
            ) : (
              <Link
                to="/login"
                className="bg-white text-[#e73535] font-semibold px-4 py-2 rounded-md hover:bg-red-100 transition-colors"
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
  className={`fixed top-0 right-0 h-full w-80 bg-white/90 backdrop-blur-md shadow-2xl border-l-4 border-red-600 transform transition-transform duration-300 z-50 flex flex-col ${
    sidebarOpen ? "translate-x-0" : "translate-x-full"
  }`}
>
  {/* 🔹 CABECERA */}
  <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white">
    <h2 className="text-xl font-semibold text-red-700">Tu Carrito</h2>
    <button
      onClick={toggleSidebar}
      aria-label="Cerrar carrito"
      className="text-red-700 hover:text-red-900 font-bold text-2xl leading-none focus:outline-none"
    >
      &times;
    </button>
  </div>

  {/* 🔹 CONTENIDO */}
  <div className="flex-grow overflow-y-auto p-4 space-y-4">
    {items.length === 0 ? (
      <p className="text-gray-500 text-center mt-6 text-lg">
        🛒 Tu carrito está vacío
      </p>
    ) : (
      items.map((item, index) => (
        <div
          key={item.id}
          className="flex justify-between items-center bg-gradient-to-r from-white via-red-50 to-white border border-red-300 rounded-xl p-3 shadow-sm hover:shadow-lg hover:border-red-500 transition-all duration-300 hover:scale-[1.02]"
          style={{
            animation: `fadeInUp 0.3s ease forwards`,
            animationDelay: `${index * 0.1}s`,
          }}
        >
          <div className="flex flex-col">
            <p className="font-bold text-gray-900 text-lg">{item.nombre}</p>
            <p className="text-sm text-gray-700">
              {item.qty} × S/.{Number(item.precio).toFixed(2)}
            </p>
          </div>
          <button
            onClick={() => removeItem(item.id)}
            className="text-red-500 hover:text-white hover:bg-red-500 border border-red-400 rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg transition-all duration-300"
          >
            ✕
          </button>
        </div>
      ))
    )}
  </div>

  {/* 🔹 PIE */}
  <div className="p-4 bg-gradient-to-t from-red-100 to-white border-t-2 border-red-600 rounded-b-lg shadow-inner">
    <div className="flex justify-between items-center font-semibold text-red-700 text-lg mb-2">
      <span>Total:</span>
      <span className="text-2xl font-bold text-red-800">
        S/.{totalPrice.toFixed(2)}
      </span>
    </div>

    <button
      disabled={items.length === 0}
      onClick={() => setShowPay(true)}
      className={`w-full py-3 rounded-lg font-bold text-white tracking-wide transition-all ${
        items.length === 0
          ? "bg-red-300 cursor-not-allowed"
          : "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-lg hover:shadow-xl"
      }`}
    >
      💳 Finalizar compra
    </button>

    {/* 🔹 PAYPAL + DATOS GUEST */}
    {showPay && items.length > 0 && (
      <div className="mt-4 bg-white/70 p-3 rounded-lg shadow-inner">
        <div className="text-sm text-gray-700 mb-2">
          Monto a pagar (USD – sandbox):{" "}
          <strong className="text-red-700">${totalUSD}</strong>
        </div>

        {!isLoggedIn && (
          <div className="mb-3 grid grid-cols-1 gap-2">
            <input
              className="border rounded px-2 py-1 focus:ring-2 focus:ring-red-400 outline-none"
              placeholder="Nombre completo"
              value={guestNombre}
              onChange={(e) => setGuestNombre(e.target.value)}
            />
            <input
              className="border rounded px-2 py-1 focus:ring-2 focus:ring-red-400 outline-none"
              placeholder="Email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
            />
            <input
              className="border rounded px-2 py-1 focus:ring-2 focus:ring-red-400 outline-none"
              placeholder="Teléfono"
              value={guestTelefono}
              onChange={(e) => setGuestTelefono(e.target.value)}
            />
            <input
              className="border rounded px-2 py-1 focus:ring-2 focus:ring-red-400 outline-none"
              placeholder="DNI"
              value={guestDni}
              onChange={(e) => setGuestDni(e.target.value)}
            />
          </div>
        )}

        <PayPalButtons
          style={{ layout: "vertical" }}
          createOrder={(data, actions) =>
            actions.order.create({
              purchase_units: [
                {
                  amount: { value: totalUSD },
                  description: "Compra en Farmacias Perú (modo prueba)",
                },
              ],
            })
          }
          onApprove={async (data, actions) => {
            const details = await actions.order.capture();
            const payer = details?.payer;
            const shipping = details?.purchase_units?.[0]?.shipping;

            const usuarioEmail = localStorage.getItem("email") || null;
            const usuarioDni = localStorage.getItem("dni") || null;
            const isUserLogged = !!localStorage.getItem("nombreUsuario");

            try {
              await fetch("http://localhost:3001/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  paypalOrderId: details.id,
                  items,
                  totalPEN: Number(totalPrice),
                  totalUSD: Number((Number(totalPrice) * 0.27).toFixed(2)),
                  paypalCurrency: "USD",
                  estado: "aprobado",
                  usuarioEmail: isUserLogged ? usuarioEmail : null,
                  usuarioDni: isUserLogged ? usuarioDni : null,
                  guestNombre: !isUserLogged ? guestNombre : null,
                  guestEmail: !isUserLogged ? guestEmail : null,
                  guestTelefono: !isUserLogged ? guestTelefono : null,
                  guestDni: !isUserLogged ? guestDni : null,
                  paypalPayerId: payer?.payer_id || null,
                  paypalPayerEmail: payer?.email_address || null,
                  shippingAddressJson: shipping
                    ? JSON.stringify(shipping)
                    : null,
                }),
              });
            } catch (e) {
              console.error("Error guardando pedido:", e);
            }

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

  {/* 🔹 ANIMACIÓN */}
  <style jsx>{`
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(15px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `}</style>
</div>




      {/* 🪟 MODAL DE INFORMACIÓN DEL PRODUCTO */}
{productoSeleccionado && (
  <div
    className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-sm z-[100]"
    onClick={() => setProductoSeleccionado(null)} // Cierra al hacer clic afuera
  >
    <div
      className="bg-white border-4 border-red-500 rounded-2xl shadow-xl p-6 relative max-w-md w-full mx-4 transition-transform transform hover:scale-105"
      onClick={(e) => e.stopPropagation()} // Evita cerrar al hacer clic dentro
    >
      {/* Botón de cerrar */}
      <button
        onClick={() => setProductoSeleccionado(null)}
        className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-2xl font-bold transition"
      >
        ×
      </button>

      {/* Imagen */}
      <img
        src={productoSeleccionado.imagen}
        alt={productoSeleccionado.nombre}
        className="w-44 h-44 mx-auto object-contain mb-4"
      />

      {/* Información */}
      <h2 className="text-2xl font-semibold text-center mb-2 text-gray-800">
        {productoSeleccionado.nombre}
      </h2>
      <p className="text-center text-gray-600 mb-3">
        {productoSeleccionado.descripcion}
      </p>
      <p className="text-center text-green-600 text-lg font-semibold mb-4">
        S/. {productoSeleccionado.precio}
      </p>

      {/* Botón añadir al carrito */}
<div className="flex justify-center">
  <button
    onClick={() => {
      addItem(productoSeleccionado, 1); // igual que en Productos.jsx
      setProductoSeleccionado(null); // cierra el modal
    }}
    className="bg-gray-800 hover:bg-black text-white px-4 py-2 rounded"
  >
    Añadir al carrito
  </button>
</div>

    </div>
  </div>
)}

    </>
  );
}
