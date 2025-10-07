import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginCliente() {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [emailUsuario, setEmailUsuario] = useState("");
  const [dniUsuario, setDniUsuario] = useState("");
  const [seccionActiva, setSeccionActiva] = useState("");
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

  const renderContenido = () => {
    switch (seccionActiva) {
      case "perfil":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-2">👤 Mi Perfil</h2>
            <p>
              <strong>Nombre:</strong> {nombreUsuario}
            </p>
            <p>
              <strong>Email:</strong> usuariao@email.com
            </p>
            <p>
              <strong>DNI:</strong> ********
            </p>
          </div>
        );
      case "historial":
        return <HistorialComprasCliente email={emailUsuario} dni={dniUsuario} />;

      case "carrito":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-2">🛍️ Mi Carrito</h2>
            <p>No tienes productos en el carrito.</p>
          </div>
        );
      case "metodosPago":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-2">💳 Métodos de Pago</h2>
            <p>Aún no has agregado ningún método de pago.</p>
          </div>
        );
      case "direcciones":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-2">
              🏠 Direcciones de Envío
            </h2>
            <p>No tienes direcciones guardadas.</p>
          </div>
        );
      case "ofertas":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-2">
              🎉 Promociones y Ofertas
            </h2>
            <p>No hay promociones disponibles en este momento.</p>
          </div>
        );
      default:
        return <p className="text-gray-600">Selecciona una opción</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-[140px] px-6">
      <div className="flex gap-6">
        <div className="w-1/4 bg-white p-6 shadow-md rounded-lg h-fit">
          <h1 className="text-lg font-bold text-red-600 mb-6">
            Bienvenido, {nombreUsuario} 👋
          </h1>

          <div className="space-y-3">
            <button
              onClick={() => setSeccionActiva("perfil")}
              className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
            >
              Ver Perfil
            </button>
            <button
              onClick={() => setSeccionActiva("historial")}
              className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
            >
              Historial de Compras
            </button>
            <button
              onClick={() => setSeccionActiva("carrito")}
              className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
            >
              Métodos de Pago
            </button>
            <button
              onClick={() => setSeccionActiva("direcciones")}
              className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
            >
              Direcciones de Envío
            </button>
            <button
              onClick={() => setSeccionActiva("ofertas")}
              className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
            >
              Promociones y Ofertas
            </button>
            <button
              onClick={handleLogout}
              className="w-full bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        <div className="w-3/4 bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Sección activa
          </h2>
          {renderContenido()}
        </div>
      </div>
    </div>
  );
}
