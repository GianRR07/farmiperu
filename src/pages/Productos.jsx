import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const { addItem } = useCart();

  useEffect(() => {
    axios
      .get("http://localhost:3001/productos")
      .then((res) => setProductos(res.data))
      .catch((err) => console.error("Error al obtener productos", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="pt-30 text-3xl font-bold text-center mb-8 text-red-600">
        Productos
      </h1>

      {/* 🧱 GRID DE PRODUCTOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productos.map((producto) => (
          <div
            key={producto.id}
            className="bg-white shadow-md rounded-lg p-4 text-center relative mx-auto max-w-sm w-full"
          >
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              {producto.nombre}
            </h2>
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="w-full h-48 object-contain mb-4"
            />
            <p className="text-lg font-medium text-green-600 mb-2">
              S/{producto.precio}
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setProductoSeleccionado(producto)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
              >
                Descripción
              </button>

              <button
                onClick={() => addItem(producto, 1)}
                className="bg-gray-800 hover:bg-black text-white px-4 py-2 rounded transition"
              >
                Añadir al carrito
              </button>
            </div>
          </div>
        ))}
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
                  addItem(productoSeleccionado, 1);
                  setProductoSeleccionado(null);
                }}
                className="bg-gray-800 hover:bg-black text-white px-4 py-2 rounded transition"
              >
                Añadir al carrito
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
