import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { AuthContext } from '../auth/AuthProvider';

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const endpoint = isRegistering ? '/auth/register' : '/auth/login';
      const res = await API.post(endpoint, {
        Username: usuario,
        Password: contrasenia
      });

      const token = res.data.token;

      //  Extraer el rol del token ANTES de login()
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const rol = (tokenPayload.rol || tokenPayload.role || "cliente").toLowerCase();

      //  Guardar token en contexto
      login(token);

      //  Redirigir según rol
      if (rol === "admin") {
        navigate('/admin');
      } else {
        navigate('/cliente');
      }
    } catch (err) {
      setError('Credenciales inválidas o error de red');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <form onSubmit={handleAuth} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}
        </h2>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={contrasenia}
          onChange={(e) => setContrasenia(e.target.value)}
          className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
        >
          {isRegistering ? 'Registrarse' : 'Ingresar'}
        </button>

        <p className="mt-4 text-center text-sm text-gray-700">
          {isRegistering ? '¿Ya tienes una cuenta?' : '¿No tienes cuenta?'}{' '}
          <button
            type="button"
            className="text-blue-600 hover:underline"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? 'Inicia sesión' : 'Regístrate'}
          </button>
        </p>
      </form>
    </div>
  );
}
