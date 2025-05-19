import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { AuthContext } from '../auth/AuthProvider';

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isRegistering) {
        await API.post('/usuario', {
          usuario,
          password,
          nombre,
          apellido,
          email,
          rol: 'cliente'
        });
      }

      // login normal
      const res = await API.post('/auth/login', { Username: usuario, Password: password });
      const token = res.data.token;

      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const rol = (tokenPayload.rol || tokenPayload.role || "cliente").toLowerCase();

      login(token);
      navigate(rol === "admin" ? "/admin" : "/cliente");
    } catch (err) {
      setError('Credenciales inválidas o error de red');
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-[#d2006e]/20 to-[#d2006e]/50">
      <form onSubmit={handleAuth} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#d2006e]">
          {isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}
        </h2>

        {error && <p className="text-[#d2006e] text-sm mb-4 text-center">{error}</p>}

        {isRegistering && (
          <>
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full mb-4 px-4 py-2 border border-[#d2006e] rounded-md focus:outline-none focus:ring focus:ring-[#d2006e]"
              required
            />
            <input
              type="text"
              placeholder="Apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              className="w-full mb-4 px-4 py-2 border border-[#d2006e] rounded-md focus:outline-none focus:ring focus:ring-[#d2006e]"
              required
            />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-4 px-4 py-2 border border-[#d2006e] rounded-md focus:outline-none focus:ring focus:ring-[#d2006e]"
              required
            />
          </>
        )}

        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          className="w-full mb-4 px-4 py-2 border border-[#d2006e] rounded-md focus:outline-none focus:ring focus:ring-[#d2006e]"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-2 border border-[#d2006e] rounded-md focus:outline-none focus:ring focus:ring-[#d2006e]"
          required
        />

        <button
          type="submit"
          className="w-full bg-[#d2006e] text-white py-2 rounded hover:bg-[#a30058] transition duration-200"
        >
          {isRegistering ? 'Registrarse' : 'Ingresar'}
        </button>

        <p className="mt-4 text-center text-sm text-[#a30058]">
          {isRegistering ? '¿Ya tienes una cuenta?' : '¿No tienes cuenta?'}{' '}
          <button
            type="button"
            className="text-[#d2006e] hover:underline"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? 'Inicia sesión' : 'Regístrate'}
          </button>
        </p>
      </form>
    </div>
  );
}
