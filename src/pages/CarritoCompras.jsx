
export default function CarritoCompras({ isOpen, onClose }) {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="p-4 flex justify-between items-center border-b">
        <h2 className="text-lg font-semibold text-red-600">Tu Carrito</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-red-600 text-xl">&times;</button>
      </div>
      <div className="p-4">
        {/* Aquí se mostrarán los productos del carrito */}
        <p className="text-gray-600">Tu carrito está vacío.</p>
        {/* En el futuro puedes mapear productos agregados aquí */}
      </div>
    </div>
  );
}
