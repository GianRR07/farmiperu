import React from 'react';
import './Contacto.css';

function Contacto() {
  return (
    <div className="contenedor-contacto">
      <main className="contenido">
        <h2>¡Mantente en línea!</h2>

        <div className="contacto-container">
          <div className="datos-contacto">
            <div className="contacto-item">
              <h3>Llámanos</h3>
              <p>(01) 729 8980</p>
              <p>(51) 920 098 339</p>
            </div>

            <div className="contacto-item">
              <h3>Escríbenos</h3>
              <p>corporacionqf@farmaciasperu.pe</p>
            </div>

            <div className="contacto-item">
              <h3>Visítanos en</h3>
              <p>Jr. Río Santa 295, Urb. Covida II Etapa. Los Olivos, Perú</p>
            </div>

            <div className="contacto-item">
              <h3>Habla con nosotros directcamente</h3>
              <p>920 098 339</p>
            </div>
          </div>

          <div className="mapa-container">
            <h3>Ubicación en Google Maps</h3>
            <iframe
              title="Ubicación de la empresa"
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d243.91782304746232!2d-77.083594!3d-11.996273!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105cfd076e0f751%3A0x980c78035b816af4!2sFARMACIAS%20PER%C3%9A!5e0!3m2!1ses!2spe!4v1757974766130!5m2!1ses!2spe"
              width="600"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Contacto;
