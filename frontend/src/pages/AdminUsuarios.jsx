import { useEffect, useState } from 'react';
import API from '../api/axios';
import { Pencil } from 'lucide-react';
import { toast } from 'react-toastify';

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [search, setSearch] = useState('');

  const cargarUsuarios = async () => {
    try {
      const res = await API.get('/usuario');
      setUsuarios(res.data);
    } catch {
      toast.error('Error al cargar usuarios');
    }
  };

  const actualizarRol = async (id, nuevoRol) => {
    try {
      await API.put(`/usuario/${id}/rol`, { rol: nuevoRol });
      toast.success('Rol actualizado');
      cargarUsuarios();
    } catch {
      toast.error('Error al actualizar rol');
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const filtrados = usuarios.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-[#d2006e] mb-6">Gestión de Usuarios</h2>
      <input
        type="text"
        placeholder="Buscar por nombre..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 px-4 py-2 border rounded w-full max-w-md border-[#d2006e] focus:ring focus:ring-[#d2006e]/50 focus:border-[#d2006e] transition"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtrados.map(user => (
          <div key={user.id} className="p-4 bg-white rounded shadow relative">
            <h3 className="text-lg font-semibold text-[#d2006e]">{user.username}</h3>
            <p className="text-gray-500 capitalize">
              Rol: <span className="text-[#d2006e]">{user.rol}</span>
            </p>
            <div className="absolute top-2 right-2 flex items-center gap-2">
              <select
                value={user.rol}
                onChange={(e) => actualizarRol(user.id, e.target.value)}
                className="text-sm border rounded px-2 py-1 border-[#d2006e] focus:ring focus:ring-[#d2006e]/50 focus:border-[#d2006e] transition"
              >
                <option value="cliente">Cliente</option>
                <option value="admin">Admin</option>
              </select>
              <Pencil
                size={18}
                className="text-[#d2006e] cursor-pointer hover:text-[#a10055] transition"
                title="Editar rol"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
