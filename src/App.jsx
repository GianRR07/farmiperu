import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "./pages/HomePage";
import MisPedidos from "./pages/MisPedidos";
import Productos from "./pages/Productos";
import Login from "./pages/Login";
import CarritoCompras from "./pages/CarritoCompras";
import QuienesSomos from './pages/QuienesSomos';
<<<<<<< HEAD
import Contacto from './pages/Contacto';
import LoginCliente from './pages/LoginCliente'; 
=======
import Contacto from './pages/Contacto'; 
import Administrador from './pages/Administrador';
>>>>>>> a5a0360ad4975dbedacf8b2b79766e0f66f89557

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import './style.css';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quienes-somos" element={<QuienesSomos />} />
            <Route path="/mis-pedidos" element={<MisPedidos />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/login" element={<Login />} />
            <Route path="/carrito" element={<CarritoCompras />} />
<<<<<<< HEAD
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/cliente" element={<LoginCliente />} />
             <Route path="/admin" element={<Administrador />} />
=======
            <Route path="/contacto" element={<Contacto />} /> 
            <Route path="/admin" element={<Administrador />} />
>>>>>>> a5a0360ad4975dbedacf8b2b79766e0f66f89557
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}


import Administrador from './pages/Administrador';

