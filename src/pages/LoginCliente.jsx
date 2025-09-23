import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginCliente() {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [seccionActiva, setSeccionActiva] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const nombre = localStorage.getItem('nombreUsuario');
    const rol = localStorage.getItem('rolUsuario');

    if (!nombre) {
      navigate('/login');
    } else {
      setNombreUsuario(nombre);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('nombreUsuario');
    localStorage.removeItem('rolUsuario');
    navigate('/login');
  };

  const renderContenido = () => {
    switch (seccionActiva) {
      case 'perfil':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-2">👤 Mi Perfil</h2>
            <p><strong>Nombre:</strong> {nombreUsuario}</p>
            <p><strong>Email:</strong> usuariao@email.com</p>
            <p><strong>DNI:</strong> ********</p>
          </div>
        );
      default:
        return <p className="text-gray-600">Selecciona una opción</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-[140px] px-6">
      <div className="flex gap-6">
        {/* Panel Izquierdo */}
        <div className="w-1/4 bg-white p-6 shadow-md rounded-lg h-fit">
          <h1 className="text-lg font-bold text-red-600 mb-6">
            Bienvenido, {nombreUsuario} 👋
          </h1>

          <div className="space-y-3">
            <button
              onClick={() => setSeccionActiva('perfil')}
              className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
            >
              Ver Perfil
            </button>

            <button
              onClick={handleLogout}
              className="w-full bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Panel Derecho */}
        <div className="w-3/4 bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Sección activa</h2>
          {renderContenido()}
        </div>
      </div>
    </div>
  );
}
