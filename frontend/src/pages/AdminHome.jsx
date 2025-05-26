import { useState, useEffect, useRef, useCallback } from 'react';
import API from '../api/axios';
import ModalsContainer from '../components/ModalsContainer';
import LoteCard from '../components/LoteCard';
import SearchBar from '../components/SearchBar';
import CategoryMultiSelect from '../components/CategoryMultiSelect';
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

  const cargarLotes = useCallback(async (page = paginaActual) => {
    try {
      if (page < 1) page = 1;
      const totalPaginas = Math.ceil(totalItems / lotesPorPagina);
      if (totalPaginas && page > totalPaginas) page = totalPaginas;

      const res = await API.get('/lote', {
        params: { page, pageSize: lotesPorPagina }
      });

      setLotes(res.data);
      setPaginaActual(page);

      const total = res.headers['x-total-count'];
      if (total) setTotalItems(Number(total));
    } catch {
      toast.error('Error al cargar lotes');
    }
  }, [paginaActual, totalItems]);

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

          // Recargar la página actual después de eliminar
          cargarLotes(paginaActual);

          // Verificar y eliminar producto si no tiene lotes restantes
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
    cargarLotes(paginaActual);
    cargarProductos();
    cargarCategorias();
  }, [cargarLotes, modalType, paginaActual]);

  const lotesFiltrados = lotes.filter(lote =>
    (lote.producto?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lote.producto?.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedCategories.length === 0 || selectedCategories.includes(lote.producto?.categoriaId))
  );

  const totalPaginas = Math.ceil(totalItems / lotesPorPagina);

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
            esAdmin={true} // Esto controla si mostramos los botones de editar y eliminar
            onEdit={() => {
              setProductoEdit(lote.producto);
              setModalType('producto');
            }}
            onDelete={() => eliminarLoteConLogica(lote.id, lote.productoId)}
          />
        ))}
      </div>

      {/* Paginación */}
      <div className="flex flex-col items-center mt-6 space-y-2">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => cargarLotes(paginaActual - 1)}
            disabled={paginaActual === 1}
            className="px-3 py-1 rounded bg-[#d2006e] text-white disabled:opacity-50"
          >
            Anterior
          </button>
          {[...Array(totalPaginas).keys()].map(num => (
            <button
              key={num + 1}
              onClick={() => cargarLotes(num + 1)}
              className={`px-3 py-1 rounded ${
                paginaActual === num + 1
                  ? 'bg-[#a30058] text-white'
                  : 'bg-[#f5d4e4] text-[#d2006e]'
              }`}
            >
              {num + 1}
            </button>
          ))}
          <button
            onClick={() => cargarLotes(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
            className="px-3 py-1 rounded bg-[#d2006e] text-white disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>

        <div className="text-[#d2006e] font-semibold">
          Página {paginaActual} de {totalPaginas || 1}
        </div>
      </div>

      <ModalsContainer
        modalType={modalType}
        setModalType={setModalType}
        productoEdit={productoEdit}
        setProductoEdit={setProductoEdit}
        categorias={categorias}
        productos={productos}
        recargarLotes={() => cargarLotes(paginaActual)}
        recargarCategorias={cargarCategorias}
      />
    </div>
  );
}
