import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";


export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [productoHover, setProductoHover] = useState(null);
  const { addItem } = useCart();


  useEffect(() => {
    axios.get("http://localhost:3001/productos")
      .then(res => setProductos(res.data))
      .catch(err => console.error("Error al obtener productos", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="pt-30 text-3xl font-bold text-center mb-8 text-red-600">Productos</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productos.map(producto => (
          <div
            key={producto.id}
            className="bg-white shadow-md rounded-lg p-4 text-center relative mx-auto max-w-sm w-full "
          >
            <h2 className="text-xl font-semibold mb-2">{producto.nombre}</h2>
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="w-full h-48 object-contain mb-4"
            />
            <p className="text-lg font-medium text-green-600 mb-2">${producto.precio}</p>

            <div className="flex justify-center gap-4">
              <div
                onMouseEnter={() => setProductoHover(producto.id)}
                onMouseLeave={() => setProductoHover(null)}
              >
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                  Descripción
                </button>
                {productoHover === producto.id && (
                  <div className="absolute bg-gray-100 border text-gray-800 p-2 mt-2 rounded shadow-lg w-full z-10">
                    {producto.descripcion}
                  </div>
                )}
              </div>

              <button
                onClick={() => addItem(producto, 1)}
                className="bg-gray-800 hover:bg-black text-white px-4 py-2 rounded">
                Añadir al carrito
              </button>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
