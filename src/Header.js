import React from 'react';
import { Link } from 'react-router-dom'; 
import './Header.css';

function Header() {
  return (
    <header className="encabezado">
      <h1>FARMACIAS PERÚ</h1>
      
      
      <nav className="menu-navegacion">
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/qsomos">Quiénes somos</Link></li>
          <li><Link to="/prodf">Productos Farmacéuticos</Link></li>
          <li><Link to="/contacto">Contacto</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
