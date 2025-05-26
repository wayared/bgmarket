import { useState, useEffect, useContext, useCallback } from 'react';
import API from '../api/axios';
import SearchBar from '../components/SearchBar';
import CategoryMultiSelect from '../components/CategoryMultiSelect';
import ComprarModal from '../components/modals/ComprarModal';
import Pagination from '../components/Pagination'; // Importamos el componente
import { toast } from 'react-toastify';
import { AuthContext } from '../auth/AuthProvider';

export default function ClientHome() {
  const [lotes, setLotes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loteSeleccionado, setLoteSeleccionado] = useState(null);

  const { logout } = useContext(AuthContext);

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const lotesPorPagina = 10;

  const totalPaginas = Math.max(1, Math.ceil(totalItems / lotesPorPagina));

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina < 1) nuevaPagina = 1;
    else if (nuevaPagina > totalPaginas) nuevaPagina = totalPaginas;
    if (nuevaPagina !== paginaActual) setPaginaActual(nuevaPagina);
  };

  // Carga lotes paginados
  const cargarLotes = useCallback(async () => {
    try {
      const res = await API.get('/lote', {
        params: { page: paginaActual, pageSize: lotesPorPagina }
      });

      const total = res.headers['x-total-count'] || res.headers['X-Total-Count'];
      const totalNum = total ? Number(total) : 0;

      setLotes(res.data);
      setTotalItems(totalNum);
    } catch (error) {
      toast.error('Error al cargar lotes');
      console.error(error);
    }
  }, [paginaActual]);

  // Carga categorías
  const cargarCategorias = async () => {
    try {
      const res = await API.get('/categoria');
      setCategorias(res.data);
    } catch {
      toast.error('Error al cargar categorías');
    }
  };

  useEffect(() => {
    cargarLotes();
  }, [cargarLotes]);

  useEffect(() => {
    cargarCategorias();
  }, []);

  // Filtrado sobre lotes cargados de la página actual
  const lotesFiltrados = lotes.filter(lote =>
    (lote.producto?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lote.producto?.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedCategories.length === 0 || selectedCategories.includes(lote.producto?.categoriaId))
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header con logout */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#d2006e]">Catálogo de Productos</h1>
        <button
          onClick={logout}
          className="bg-[#d2006e] text-white px-4 py-2 rounded hover:bg-[#b3005a] transition duration-200"
        >
          Cerrar Sesión
        </button>
      </div>

      {/* Filtros */}
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

      {/* Cards de productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lotesFiltrados.map(lote => (
          <div key={lote.id} className="bg-white p-4 shadow rounded relative">
            <h3 className="text-lg font-semibold">{lote.producto?.nombre}</h3>
            <p className="text-gray-600">{lote.producto?.descripcion}</p>
            <p className="text-[#d2006e] font-bold mt-2">${lote.precio.toFixed(2)}</p>
            <p className="text-gray-600 font-bold mt-2">Cantidad en Stock: {lote.cantidad}</p>
            <button
              onClick={() => setLoteSeleccionado(lote)}
              className="mt-4 w-full bg-[#d2006e] text-white py-2 rounded hover:bg-[#b3005a] transition duration-200"
            >
              Comprar
            </button>
          </div>
        ))}
      </div>

      {/* Componente de paginación */}
      <Pagination
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        onChangePagina={cambiarPagina}
      />

      {/* Modal compra */}
      {loteSeleccionado && (
        <ComprarModal
          lote={loteSeleccionado}
          onClose={() => setLoteSeleccionado(null)}
          onCompraExitosa={cargarLotes}
        />
      )}
    </div>
  );
}
