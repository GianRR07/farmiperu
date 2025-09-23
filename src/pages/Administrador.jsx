import React, { useState } from 'react';

export default function Administrador() {
  const [contenido, setContenido] = useState('Selecciona una opción');

  const manejarClick = (opcion) => {
    setContenido(opcion);
  };

  return (
    <div className="pt-30 bg-gray-50 min-h-screen max-h-screen overflow-y-auto px-6 pt-8">
      <h1 className="text-4xl font-bold text-red-600 mb-8">Bienvenido Administrador</h1>

      <div className="flex gap-6 min-h-[75vh]">
        <div className="w-1/4 bg-white shadow-md rounded-lg p-4 space-y-4">
          <button onClick={() => manejarClick('Registrar Producto')} className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded">
            Registrar Producto
          </button>
          <button onClick={() => manejarClick('Registrar Nuevo Administrador')} className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded">
            Registrar Nuevo Administrador
          </button>
          <button onClick={() => manejarClick('Eliminar producto')} className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded">
            Eliminar producto
          </button>
          <button onClick={() => manejarClick('Editar producto')} className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded">
            Editar producto
          </button>
          <button onClick={() => manejarClick('Generar Reporte de ventas')} className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded">
            Generar Reporte de ventas
          </button>
          <button onClick={() => manejarClick('Revisar Ventas')} className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded">
            Revisar Ventas
          </button>
        </div>

        <div className="flex-1 bg-white shadow-md rounded-lg p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Sección activa</h2>
          <p className="text-gray-600">{contenido}</p>
        </div>
      </div>
    </div>
  );
}
