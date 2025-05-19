import { useState, useContext } from 'react';
import AdminHome from './AdminHome';
import ManageUsers from './ManageUsers';
import { AuthContext } from '../auth/AuthProvider'; // Ajusta la ruta según tu estructura

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState('productos');
  const { logout } = useContext(AuthContext);

  const renderView = () => {
    switch (activeView) {
      case 'productos':
        return <AdminHome />;
      case 'usuarios':
        return <ManageUsers />;
      default:
        return <AdminHome />;
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-md p-6 flex flex-col">
        <h2 className="text-xl font-bold mb-6 text-[#d2006e]">Panel Admin</h2>
        <ul className="space-y-4 flex-grow">
          <li>
            <button
              className={`w-full text-left px-4 py-2 rounded ${
                activeView === 'productos'
                  ? 'bg-[#f5d4e4] text-[#d2006e] font-semibold'
                  : 'hover:bg-[#fce8f1]'
              }`}
              onClick={() => setActiveView('productos')}
            >
              Gestionar Productos
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left px-4 py-2 rounded ${
                activeView === 'usuarios'
                  ? 'bg-[#f5d4e4] text-[#d2006e] font-semibold'
                  : 'hover:bg-[#fce8f1]'
              }`}
              onClick={() => setActiveView('usuarios')}
            >
              Gestionar Usuarios
            </button>
          </li>
        </ul>
        <button
          onClick={logout}
          className="mt-auto w-full bg-[#d2006e] text-white py-2 rounded hover:bg-[#a30058] transition duration-200"
        >
          Cerrar Sesión
        </button>
      </aside>

      {/* Vista activa */}
      <main className="flex-1 bg-gray-100">
        {renderView()}
      </main>
    </div>
  );
}
