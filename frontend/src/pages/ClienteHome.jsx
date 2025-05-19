// src/pages/ClientHome.jsx
import { useState, useEffect, useContext } from 'react';
import API from '../api/axios';
import SearchBar from '../components/SearchBar';
import CategoryMultiSelect from '../components/CategoryMultiSelect';
import ComprarModal from '../components/modals/ComprarModal';
import { toast } from 'react-toastify';
import { AuthContext } from '../auth/AuthProvider'; 

export default function ClientHome() {
  const [lotes, setLotes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loteSeleccionado, setLoteSeleccionado] = useState(null); // Para el modal

  const { logout } = useContext(AuthContext);

  const cargarDatos = async () => {
    try {
      const [resLotes, resCategorias] = await Promise.all([
        API.get('/lote'),
        API.get('/categoria')
      ]);
      setLotes(resLotes.data);
      setCategorias(resCategorias.data);
    } catch (error) {
      toast.error('Error al cargar datos');
      console.error(error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const lotesFiltrados = lotes.filter(lote =>
    (lote.producto?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     lote.producto?.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedCategories.length === 0 || selectedCategories.includes(lote.producto?.categoriaId))
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header with Logout */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#d2006e]">Catálogo de Productos</h1>
        <button
          onClick={logout}
          className="bg-[#d2006e] text-white px-4 py-2 rounded hover:bg-[#b3005a] transition duration-200"
        >
          Cerrar Sesión
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="w-full sm:w-[280px]">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>
        <div className="w-full sm:w-[280px]">
          <CategoryMultiSelect
            categorias={categorias}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />
        </div>
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lotesFiltrados.map(lote => (
          <div key={lote.id} className="bg-white p-4 shadow rounded relative">
            <h3 className="text-lg font-semibold">{lote.producto?.nombre}</h3>
            <p className="text-gray-600">{lote.producto?.descripcion}</p>
            <p className="text-[#d2006e] font-bold mt-2">${lote.precio.toFixed(2)}</p>
            <button
              onClick={() => setLoteSeleccionado(lote)}
              className="mt-4 w-full bg-[#d2006e] text-white py-2 rounded hover:bg-[#b3005a] transition duration-200"
            >
              Comprar
            </button>
          </div>
        ))}
      </div>

      {/* Modal de compra */}
      {loteSeleccionado && (
        <ComprarModal
          lote={loteSeleccionado}
          onClose={() => setLoteSeleccionado(null)}
          onCompraExitosa={cargarDatos}
        />
      )}
    </div>
  );
}
