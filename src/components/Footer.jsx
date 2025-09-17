export default function Footer() {
  return (
    <footer className="bg-[#e73535ff] text-white py-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div>
          <ul className="space-y-2">
            <li className="cursor-pointer hover:text-red-300">Inicio</li>
            <li className="cursor-pointer hover:text-red-300">¿Quiénes somos?</li>
            <li className="cursor-pointer hover:text-red-300">Políticas de privacidad</li>
            <li className="cursor-pointer hover:text-red-300">Libro de reclamaciones</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-3">Productos</h3>
          <ul className="space-y-2">
            <li className="cursor-pointer hover:text-red-300">Productos farmacéuticos</li>
            <li className="cursor-pointer hover:text-red-300">Dispositivos médicos</li>
            <li className="cursor-pointer hover:text-red-300">Productos sanitarios</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-3">Contacto</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span>✉️</span> corporacionqf@farmaciasperu.pe
            </li>
            <li className="flex items-center gap-2">
              <span>📱</span> 920 098 339
            </li>
            <li className="flex items-center gap-2">
              <span>📞</span> 01 729 8980
            </li>
            <li className="flex items-center gap-2">
              <span>📍</span> Jr. Río Santa 295, Urb. Covida II Etapa. Los Olivos, Perú
            </li>
          </ul>
        </div>

      </div>
    </footer>
  );
}
