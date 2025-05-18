import { useNavigate } from 'react-router-dom';

export default function AdminHome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-green-700 mb-8">Panel de Administración</h1>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">Gestión de Productos</h2>
          <p className="text-gray-600 text-sm mb-4">
            Agrega, edita o elimina productos del sistema.
          </p>
          <button
            onClick={() => navigate('/admin/productos')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Ir a productos
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">Visualizar Logs</h2>
          <p className="text-gray-600 text-sm mb-4">
            Consulta los registros de acciones del sistema.
          </p>
          <button
            onClick={() => alert('Funcionalidad pendiente')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Ver logs
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">Cerrar Sesión</h2>
          <p className="text-gray-600 text-sm mb-4">
            Finaliza tu sesión de forma segura.
          </p>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Salir
          </button>
        </div>
      </div>
    </div>
  );
}
