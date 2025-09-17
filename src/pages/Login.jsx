import React, { useState } from 'react';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    else if (name === 'password') setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const response = await axios.post('http://localhost:3001/login', { email, password });
        setMessage('Iniciaste sesión con éxito');
      } else {
        const response = await axios.post('http://localhost:3001/registro', { email, password });
        setMessage('Ahora puedes iniciar sesión');
      }
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data || 'Ocurrió un error. Intenta de nuevo');
      } else {
        setMessage('Error de conexión. Intenta más tarde');
      }
      setTimeout(() => setMessage(''), 5000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg overflow-hidden md:flex">
        
        {/* Formulario */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold mb-6 text-red-600">{isLogin ? 'Iniciar sesión' : 'Registrarse'}</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block mb-2 font-semibold text-gray-700">Correo electrónico:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleInputChange}
                placeholder="Ingresa tu correo"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-2 font-semibold text-gray-700">Contraseña:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handleInputChange}
                placeholder="Ingresa tu contraseña"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 text-white font-semibold py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              {isLogin ? 'Iniciar sesión' : 'Registrar'}
            </button>
          </form>

          <button
            onClick={() => setIsLogin(!isLogin)}
            className="mt-4 text-sm text-red-600 hover:underline focus:outline-none"
          >
            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>

          {message && (
            <div className="mt-4 p-3 rounded bg-red-100 text-red-700 font-medium">
              {message}
            </div>
          )}
        </div>

        {/* Promo (solo en md y superior) */}
        <div className="hidden md:flex flex-col justify-center bg-red-600 text-white p-8 md:w-1/2">
          <h2 className="text-3xl font-bold mb-4">¡Promoción de la semana!</h2>
          <p className="text-lg leading-relaxed">
            Obtén un <span className="font-bold">20% de descuento</span> en todos nuestros productos farmacéuticos. ¡Aprovecha la oferta!
          </p>
        </div>
      </div>
    </div>
  );
}
