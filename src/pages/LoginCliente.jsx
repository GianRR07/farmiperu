import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DireccionMap from "../components/DireccionMap"; // ⬅️ Tu componente del mapa

export default function LoginCliente() {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [emailUsuario, setEmailUsuario] = useState("");
  const [dniUsuario, setDniUsuario] = useState("");
  const [seccionActiva, setSeccionActiva] = useState("perfil"); // ⬅️ Mostrar perfil al iniciar
  const [direccionSeleccionada, setDireccionSeleccionada] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const nombre = localStorage.getItem("nombreUsuario");
    const rol = localStorage.getItem("rolUsuario");
    const email = localStorage.getItem("email");
    const dni = localStorage.getItem("dni");

    if (!nombre) {
      navigate("/login");
    } else {
      setNombreUsuario(nombre);
      setEmailUsuario(email || "");
      setDniUsuario(dni || "");
      setSeccionActiva("perfil");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("nombreUsuario");
    localStorage.removeItem("rolUsuario");
    localStorage.removeItem("email");
    localStorage.removeItem("dni");
    window.dispatchEvent(new Event("loginStateChanged"));
    navigate("/");
  };

  function HistorialComprasCliente({ email, dni }) {
    const [ventas, setVentas] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [msg, setMsg] = React.useState('');
    const [expanded, setExpanded] = React.useState({});

    const fetchMine = async () => {
      try {
        setLoading(true);
        setMsg('');
        const params = new URLSearchParams();
        if (email) params.append('email', email);
        if (dni) params.append('dni', dni);
        const res = await axios.get(`http://localhost:3001/orders/by-user?${params.toString()}`);
        setVentas(res.data || []);
      } catch (e) {
        console.error(e);
        setMsg('No se pudo cargar tu historial.');
      } finally {
        setLoading(false);
      }
    };

    React.useEffect(() => {
      if (email || dni) fetchMine();
    }, [email, dni]);

    const fmtSoles = (v) => `S/ ${Number(v || 0).toFixed(2)}`;
    const fmtUSD = (v) => `$ ${Number(v || 0).toFixed(2)}`;
    const toggle = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

    return (
      <div>
        <h2 className="text-xl font-semibold mb-2">🛒 Historial de Compras</h2>
        {loading && <p>Cargando...</p>}
        {msg && <p className="text-red-600 mb-2">{msg}</p>}

        {!loading && ventas.length === 0 ? (
          <p>No tienes compras registradas.</p>
        ) : (
          <table className="min-w-full table-auto border">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-3 py-2 border text-left">Fecha</th>
                <th className="px-3 py-2 border text-left">PayPal Order</th>
                <th className="px-3 py-2 border text-left">Estado</th>
                <th className="px-3 py-2 border text-right">Total (S/)</th>
                <th className="px-3 py-2 border text-right">Total (USD)</th>
                <th className="px-3 py-2 border text-center">Ítems</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map(v => (
                <React.Fragment key={v.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-2 border">{new Date(v.fecha).toLocaleString()}</td>
                    <td className="px-3 py-2 border">{v.paypal_order_id || '—'}</td>
                    <td className="px-3 py-2 border">{v.estado || '—'}</td>
                    <td className="px-3 py-2 border text-right">{fmtSoles(v.total_pen)}</td>
                    <td className="px-3 py-2 border text-right">{fmtUSD(v.total_usd)}</td>
                    <td className="px-3 py-2 border text-center">
                      <button
                        onClick={() => toggle(v.id)}
                        className="text-blue-600 hover:underline"
                      >
                        {expanded[v.id] ? 'Ocultar' : 'Ver'}
                      </button>
                    </td>
                  </tr>
                  {expanded[v.id] && (
                    <tr>
                      <td className="px-3 py-2 border bg-gray-50" colSpan={6}>
                        {!v.items || v.items.length === 0 ? (
                          <p className="text-sm text-gray-600">Sin ítems.</p>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="min-w-full table-auto border">
                              <thead>
                                <tr className="bg-gray-100">
                                  <th className="px-2 py-1 border text-left">Producto</th>
                                  <th className="px-2 py-1 border text-right">Precio (S/)</th>
                                  <th className="px-2 py-1 border text-right">Cantidad</th>
                                  <th className="px-2 py-1 border text-right">Subtotal (S/)</th>
                                </tr>
                              </thead>
                              <tbody>
                                {v.items.map(it => (
                                  <tr key={it.id}>
                                    <td className="px-2 py-1 border">{it.nombre}</td>
                                    <td className="px-2 py-1 border text-right">{fmtSoles(it.precio_pen)}</td>
                                    <td className="px-2 py-1 border text-right">{it.qty}</td>
                                    <td className="px-2 py-1 border text-right">
                                      {fmtSoles(Number(it.precio_pen) * Number(it.qty))}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }

  // 👇 CONTENIDO DE CADA SECCIÓN
  const renderContenido = () => {
    switch (seccionActiva) {
      case "perfil":
        return (
          <div className="p-6 rounded-xl bg-gradient-to-br from-red-50 to-white shadow-lg">
            <div className="flex items-center gap-4">
              <img
                src="https://cdn-icons-png.flaticon.com/512/219/219970.png"
                alt="perfil"
                className="w-20 h-20 rounded-full border-2 border-red-400"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{nombreUsuario}</h2>
                <p className="text-gray-600">👤 Cliente registrado</p>
              </div>
            </div>
            <div className="mt-6 space-y-2 text-gray-700">
              <p><strong>Email:</strong> {emailUsuario}</p>
              <p><strong>DNI:</strong> {dniUsuario}</p>
              <p><strong>Estado:</strong> Activo ✅</p>
            </div>
          </div>
        );

      case "historial":
        return <HistorialComprasCliente email={emailUsuario} dni={dniUsuario} />;

     

      case "metodosPago":
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold mb-3">💳 Métodos de Pago</h2>

      <div className="bg-blue-50 border border-blue-200 p-5 rounded-lg shadow-sm">
        <p className="text-gray-700 mb-3 leading-relaxed">
          En <strong>FarmiPerú</strong> usamos <span className="font-semibold">PayPal</span> como nuestro método
          principal de pago, garantizando transacciones seguras y rápidas 🔒.
        </p>
        <ul className="list-disc pl-5 text-gray-600 mb-4">
          <li>Protege tus datos y tus compras.</li>
          <li>Permite pagar con tarjeta o saldo PayPal.</li>
          <li>Pagos internacionales sin complicaciones.</li>
        </ul>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <img
            src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_74x46.jpg"
            alt="PayPal logo"
            className="w-32"
          />
          
          {/* Este es el contenedor que coloca el texto arriba del botón */}
          <div className="text-center sm:text-left">
            <p className="text-gray-700 mb-2">
              Si eres nuevo, te invito a crearte una cuenta nueva.
            </p>
            <button
              onClick={() => window.open("https://www.paypal.com/signup", "_blank")}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 px-5 py-2 rounded-md font-semibold shadow-md transition-all"
            >
              Crear cuenta PayPal
            </button>
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-600">
        ¿Tienes dudas? Contáctanos para ayudarte a configurar tu pago 💬
      </div>
    </div>
  );



      case "direcciones":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-3">🏠 Direcciones de Envío</h2>
            <p className="text-gray-600 mb-3">
              Selecciona tu ubicación actual o busca una nueva dirección.
            </p>

            <DireccionMap onDireccionSeleccionada={setDireccionSeleccionada} />

            {direccionSeleccionada && (
              <div className="mt-4 p-4 bg-green-50 border border-green-300 rounded-md">
                <strong>📍 Dirección guardada:</strong>
                <p>{direccionSeleccionada.direccion}</p>
              </div>
            )}
          </div>
        );

      case "ofertas":
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold mb-3">Promociones y Ofertas</h2>

      <div className="bg-gradient-to-b from-red-500 to-white p-6 rounded-lg shadow-xl text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          ¡Compra más de 80 soles y recibe DELIVERY GRATIS!
        </h3>
        <p className="text-lg text-gray-800 mb-4">
          ¡No dejes pasar esta increíble oferta! Solo por tiempo limitado, disfruta de envío sin costo al realizar compras superiores a 80 soles.
        </p>
        <button
          onClick={() => window.open("/", "_self")}
          className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-md"
        >
          ¡Aprovecha esta oferta!
        </button>
      </div>
    </div>
  );



      default:
        return <p className="text-gray-600">Selecciona una opción</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-[140px] px-6">
      <div className="flex gap-6">
        {/* 📌 Menú lateral */}
        <div className="w-1/4 bg-white p-6 shadow-md rounded-lg h-fit">
          <h1 className="text-lg font-bold text-red-600 mb-6">
            Bienvenido, {nombreUsuario} 👋
          </h1>

          <div className="space-y-3">
            <button onClick={() => setSeccionActiva("perfil")} className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600">Ver Perfil</button>
            <button onClick={() => setSeccionActiva("historial")} className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600">Historial de Compras</button>
            
            <button onClick={() => setSeccionActiva("metodosPago")} className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600">Métodos de Pago</button>
            <button onClick={() => setSeccionActiva("direcciones")} className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600">Direcciones de Envío</button>
            <button onClick={() => setSeccionActiva("ofertas")} className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600">Promociones y Ofertas</button>
            <button onClick={handleLogout} className="w-full bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700">Cerrar Sesión</button>
          </div>
        </div>

        {/* 📌 Contenido principal */}
        <div className="w-3/4 bg-white p-8 rounded-lg shadow-md">
          {renderContenido()}
        </div>
      </div>
    </div>
  );
}
