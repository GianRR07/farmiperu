import React, { useState } from 'react';
import './Qsomos.css';  
function Qsomos() {
  const [misionVisible, setMisionVisible] = useState(false);
  const [visionVisible, setVisionVisible] = useState(false);

  return (
    <div className="contenedor-qsomos">
      <main className="contenido">
        
        <p>
          Somos una empresa Peruana dedicada al Cuidado de la Salud, Comercialización,
          Dispensación, Expendio de calidad, de Productos Farmacéuticos, Dispositivos Médicos
          y Productos Sanitarios.
        </p>

        <div className="flipboxes">
          <div
            className={`flipbox ${misionVisible ? "show" : ""}`}
            onClick={() => setMisionVisible(!misionVisible)}
          >
            <h3>{misionVisible ? "" : "Misión"}</h3>
            <p>
              Brindar un servicio de calidad, ofreciendo productos seguros y eficaces para
              cuidar la salud con excelentes asesoramientos farmacéuticos solucionando los diversos problemas de salud de la comunidad, acorde a las exigencias de las familias peruanas.
            </p>
          </div>

          <div
            className={`flipbox ${visionVisible ? "show" : ""}`}
            onClick={() => setVisionVisible(!visionVisible)}
          >
            <h3>{visionVisible ? "" : "Visión"}</h3>
            <p>
              Ser el Establecimiento Farmacéutico “Farmacia” peruano con autenticidad,
              reconocimiento y aceptación por los ciudadanos en cuidado del bienestar y la salud de todas las familias peruanas.
            </p>
          </div>
        </div>

        <div className="franja-roja">
          <p>Como profesionales de la salud tenemos más de 10 años en el sector salud cuidando la salud y el bienestar de todas las familias peruanas.</p>
        </div>

        <div className="nuestros-valores">
          <h2>Nuestros valores</h2>
          <div className="valores-container">
            <div className="valor">
              <img src={require('./images/valor1.PNG')} alt="valor1" />
              <p>Personas capacitadas y<br></br> honestas al cumplir sus funciones</p>
            </div>
            <div className="valor">
              <img src={require('./images/valor2.PNG')} alt="valor2" />
              <p>Dedicados a la atención personalizada<br></br> de nuestros pacientes y sus necesidades</p>
            </div>
            <div className="valor">
              <img src={require('./images/valor3.PNG')} alt="valor3" />
              <p>Comprometidos con la salud y<br></br> el bienestar de nuestros pacientes</p>
            </div>
            <div className="valor">
              <img src={require('./images/valor4.PNG')} alt="valor4" />
              <p>Personal con liderazgo <br></br>absoluto</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Qsomos;
