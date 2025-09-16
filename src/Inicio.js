import React, { useState } from 'react';
import axios from 'axios'; 
import './Inicio.css';

function Inicio() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); 
  const [message, setMessage] = useState(''); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      try {
        const response = await axios.post('http://localhost:3001/login', { email, password });
        console.log(response.data.message);
        setMessage('Iniciaste sesión con éxito');
        setTimeout(() => setMessage(''), 5000); 
      } catch (error) {
        if (error.response) {
          console.error('Error al iniciar sesión:', error.response.data);
          setMessage(error.response.data || 'Error al iniciar sesión. Intenta de nuevo');
        } else {
          console.error('Error de red:', error);
          setMessage('Error de conexión. Intenta de nuevo más tarde');
        }
        setTimeout(() => setMessage(''), 5000);
      }
    } else {
      try {
        const response = await axios.post('http://localhost:3001/registro', { email, password });
        console.log(response.data.message);
        setMessage('Ahora puedes iniciar sesión');
        setTimeout(() => setMessage(''), 5000); 
      } catch (error) {
        if (error.response) {
          console.error('Error al registrar usuario:', error.response.data);
          setMessage(error.response.data || 'Error al registrar. Intenta de nuevo');
        } else {
          console.error('Error de red:', error);
          setMessage('Error de conexión. Intenta de nuevo más tarde');
        }
        setTimeout(() => setMessage(''), 5000);
      }
    }
  };

  return (
    <div className="contenedor-Inicio">
      <main className="contenido-Inicio">
        <div className="inicio-container">
          <div className="form-container-inicio">
            <h2>{isLogin ? 'Iniciar sesión' : 'Registrarse'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="email">Correo electrónico:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleInputChange}
                  placeholder="Ingresa tu correo"
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="password">Contraseña:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleInputChange}
                  placeholder="Ingresa tu contraseña"
                  required
                />
              </div>
              <button type="submit">{isLogin ? 'Iniciar sesión' : 'Registrar'}</button>
            </form>
            <button onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>

            {message && <div className="message">{message}</div>}
          </div>

          <div className="promo-container-inicio">
            <h2>¡Promoción de la semana!</h2>
            <p>Obtén un 20% de descuento en todos nuestros productos farmacéuticos. ¡Aprovecha la oferta!</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Inicio;
