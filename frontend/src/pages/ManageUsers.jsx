import { useState, useEffect } from 'react';
import API from '../api/axios';
import { Pencil } from 'lucide-react';
import { toast } from 'react-toastify';

export default function ManageUsers() {
  const [usuarios, setUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [usuarioEdit, setUsuarioEdit] = useState(null);
  const [rolEdit, setRolEdit] = useState('');

  // Carga usuarios desde API
  const cargarUsuarios = async () => {
    try {
      const res = await API.get('/usuario');
      setUsuarios(res.data);
    } catch (error) {
      toast.error('Error al cargar usuarios');
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // Filtrado por búsqueda (nombre, usuario, email)
  const usuariosFiltrados = usuarios.filter(u =>
    u.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.usuario?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Guardar cambios de rol al usuario editado
  const guardarCambios = async () => {
    if (!usuarioEdit) return;

    try {
      await API.put(`/usuario/${usuarioEdit.id}`, {
        ...usuarioEdit,
        rol: rolEdit,
      });
      toast.success('Rol actualizado correctamente');
      setUsuarioEdit(null);
      cargarUsuarios();
    } catch (error) {
      toast.error('Error al actualizar usuario');
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold text-[#d2006e] mb-6">Gestión de Usuarios</h1>

      <input
        type="text"
        placeholder="Buscar usuarios..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="mb-6 px-4 py-2 border rounded w-full max-w-md border-[#d2006e] focus:ring focus:ring-[#d2006e]/50 focus:border-[#d2006e]"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {usuariosFiltrados.map(u => (
          <div key={u.id} className="bg-white p-4 rounded shadow relative">
            <h3 className="font-semibold text-lg text-[#d2006e]">{u.nombre} {u.apellido}</h3>
            <p className="text-gray-600">Usuario: {u.usuario}</p>
            <p className="text-gray-600">Email: {u.email}</p>
            <p className="text-gray-800 font-bold mt-2">Rol: <span className="text-[#d2006e]">{u.rol}</span></p>
            <button
              className="absolute top-2 right-2 text-[#d2006e] hover:text-[#a50054] flex items-center gap-1"
              onClick={() => {
                setUsuarioEdit(u);
                setRolEdit(u.rol);
              }}
              aria-label="Editar usuario"
            >
              <Pencil size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* Modal simple para editar rol */}
      {usuarioEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4 text-[#d2006e]">Editar Rol</h2>
            <p className="mb-2">Usuario: <b>{usuarioEdit.usuario}</b></p>
            <label className="block mb-2">
              Seleccione el rol:
              <select
                className="w-full border rounded px-3 py-2 mt-1 border-[#d2006e] focus:ring focus:ring-[#d2006e]/50 focus:border-[#d2006e]"
                value={rolEdit}
                onChange={e => setRolEdit(e.target.value)}
              >
                <option value="cliente">Cliente</option>
                <option value="admin">Admin</option>
              </select>
            </label>

            <div className="flex justify-end gap-4 mt-6">
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setUsuarioEdit(null)}
              >
                Cancelar
              </button>
              <button
                className="bg-[#d2006e] text-white px-4 py-2 rounded hover:bg-[#a50054]"
                onClick={guardarCambios}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
