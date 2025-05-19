import { useState, useEffect, useRef } from 'react';
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

  const cargarLotes = async () => {
    try {
      const res = await API.get('/lote');
      setLotes(res.data);
    } catch {
      toast.error('Error al cargar lotes');
    }
  };

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
          const res = await API.get('/lote');
          const lotesRestantes = res.data.filter(l => l.productoId === productoId);
          if (lotesRestantes.length === 0) {
            await API.delete(`/producto/${productoId}`);
            toast.info('El producto también fue eliminado porque no tenía más lotes');
          }
          cargarLotes();
        } catch (error) {
          toast.error('Error al eliminar lote');
          console.error(error);
        }
      }
    });
  };

  useEffect(() => {
    cargarLotes();
    cargarProductos();
    cargarCategorias();
    if (modalType === 'lote') cargarLotes();
  }, [modalType]);

  const lotesFiltrados = lotes.filter(lote =>
    (lote.producto?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lote.producto?.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedCategories.length === 0 || selectedCategories.includes(lote.producto?.categoriaId))
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-[#d2006e] mb-6">Panel de Administración</h1>

      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        {/* Botón + buscador */}
        <div className="relative flex items-center gap-4 flex-grow" ref={dropdownRef}>
          <button
            className="bg-[#d2006e] text-white font-semibold px-5 py-2 rounded-full shadow hover:bg-[#a30058]"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            + Nuevo
          </button>

          {/* Buscador */}
          <div className="w-full max-w-sm">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
          </div>

          {/* Dropdown manual */}
          {menuOpen && (
            <div className="absolute top-[48px] left-0 w-60 bg-white border rounded shadow z-50">
              <p className="text-xs text-[#d2006e] font-bold px-4 pt-3">Acciones</p>
              <ul className="text-gray-800">
                <li className="hover:bg-gray-100 px-4 py-2 cursor-pointer"
                  onClick={() => { setProductoEdit(null); setModalType('producto'); setMenuOpen(false); }}>
                  Nuevo Producto
                </li>
                <li className="hover:bg-gray-100 px-4 py-2 cursor-pointer"
                  onClick={() => { setModalType('lote'); setMenuOpen(false); }}>
                  Nuevo Lote
                </li>
                <li className="hover:bg-gray-100 px-4 py-2 cursor-pointer"
                  onClick={() => { setModalType('categoria'); setMenuOpen(false); }}>
                  Nueva Categoría
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Filtro categoría */}
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
          <LoteCard
            key={lote.id}
            lote={lote}
            onEdit={() => { setProductoEdit(lote.producto); setModalType('producto'); }}
            onDelete={() => eliminarLoteConLogica(lote.id, lote.productoId)}
          />
        ))}
      </div>

      {/* Modales */}
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
