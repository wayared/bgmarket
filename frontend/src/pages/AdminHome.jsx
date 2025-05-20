import { useState, useEffect, useRef, useCallback } from 'react';
import API from '../api/axios';
import ModalsContainer from '../components/ModalsContainer';
import LoteCard from '../components/LoteCard';
import SearchBar from '../components/SearchBar';
import CategoryMultiSelect from '../components/CategoryMultiSelect';
import Pagination from '../components/Pagination'; // Importamos el componente
import { toast } from 'react-toastify';
import { confirmAction } from '../utils/confirmDialog';

export default function AdminHome() {
  const [modalType, setModalType] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lotes, setLotes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [productoEdit, setProductoEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const lotesPorPagina = 10;

  const dropdownRef = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalPaginas = Math.max(1, Math.ceil(totalItems / lotesPorPagina));

  // Corrección simple para evitar páginas fuera de rango
  useEffect(() => {
    if (paginaActual > totalPaginas) {
      setPaginaActual(totalPaginas);
    }
    if (paginaActual < 1) {
      setPaginaActual(1);
    }
  }, [paginaActual, totalPaginas]);

  const cargarLotes = useCallback(async () => {
    try {
      const res = await API.get('/lote', {
        params: { page: paginaActual, pageSize: lotesPorPagina }
      });

      const total = res.headers['x-total-count'] || res.headers['X-Total-Count'];
      const totalNum = total ? Number(total) : 0;

      setLotes(res.data);
      setTotalItems(totalNum);
    } catch {
      toast.error('Error al cargar lotes');
    }
  }, [paginaActual]);

  const cargarProductos = async () => {
    try {
      const res = await API.get('/producto');
      setProductos(res.data);
    } catch {
      toast.error('Error al cargar productos');
    }
  };

  const cargarCategorias = async () => {
    try {
      const res = await API.get('/categoria');
      setCategorias(res.data);
    } catch {
      toast.error('Error al cargar categorías');
    }
  };

  const eliminarLoteConLogica = async (loteId, productoId) => {
    confirmAction({
      message: "¿Eliminar este lote?",
      onConfirm: async () => {
        try {
          await API.delete(`/lote/${loteId}`);
          toast.success('Lote eliminado con éxito');

          await cargarLotes();

          const resLotes = await API.get('/lote', { params: { page: 1, pageSize: 1000 } });
          const lotesRestantes = resLotes.data.filter(l => l.productoId === productoId);
          if (lotesRestantes.length === 0) {
            await API.delete(`/producto/${productoId}`);
            toast.info('El producto también fue eliminado porque no tenía más lotes');
          }
        } catch (error) {
          toast.error('Error al eliminar lote');
          console.error(error);
        }
      }
    });
  };

  useEffect(() => {
    cargarLotes();
  }, [cargarLotes]);

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, [modalType]);

  // Filtrado frontend
  const lotesFiltrados = lotes.filter(lote =>
    (lote.producto?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lote.producto?.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedCategories.length === 0 || selectedCategories.includes(lote.producto?.categoriaId))
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-[#d2006e] mb-6">Panel de Administración</h1>

      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="relative flex items-center gap-4 flex-grow" ref={dropdownRef}>
          <button
            className="bg-[#d2006e] text-white font-semibold px-5 py-2 rounded-full shadow hover:bg-[#a30058]"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            + Nuevo
          </button>

          <div className="w-full max-w-sm">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
          </div>

          {menuOpen && (
            <div className="absolute top-[48px] left-0 w-60 bg-white border rounded shadow z-50">
              <p className="text-xs text-[#d2006e] font-bold px-4 pt-3">Acciones</p>
              <ul className="text-gray-800">
                <li
                  className="hover:bg-gray-100 px-4 py-2 cursor-pointer"
                  onClick={() => {
                    setProductoEdit(null);
                    setModalType('producto');
                    setMenuOpen(false);
                  }}
                >
                  Nuevo Producto
                </li>
                <li
                  className="hover:bg-gray-100 px-4 py-2 cursor-pointer"
                  onClick={() => {
                    setModalType('lote');
                    setMenuOpen(false);
                  }}
                >
                  Nuevo Lote
                </li>
                <li
                  className="hover:bg-gray-100 px-4 py-2 cursor-pointer"
                  onClick={() => {
                    setModalType('categoria');
                    setMenuOpen(false);
                  }}
                >
                  Nueva Categoría
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="w-full sm:w-[280px]">
          <CategoryMultiSelect
            categorias={categorias}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lotesFiltrados.map(lote => (
          <LoteCard
            key={lote.id}
            lote={lote}
            onEdit={() => {
              setProductoEdit(lote.producto);
              setModalType('producto');
            }}
            onDelete={() => eliminarLoteConLogica(lote.id, lote.productoId)}
          />
        ))}
      </div>

      {/* Usamos el componente de paginación aquí */}
      <Pagination
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        onChangePagina={setPaginaActual}
      />

      <ModalsContainer
        modalType={modalType}
        setModalType={setModalType}
        productoEdit={productoEdit}
        setProductoEdit={setProductoEdit}
        categorias={categorias}
        productos={productos}
        recargarLotes={cargarLotes}
        recargarCategorias={cargarCategorias}
      />
    </div>
  );
}
