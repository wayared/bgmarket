import { useState, useEffect } from 'react';
import API from '../api/axios';
import { toast } from 'react-toastify';
import MovimientoModal from '../components/modals/MovimientoModal';

export default function ManageInventory() {
  const [movimientos, setMovimientos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [lotes, setLotes] = useState([]);
  const [loteSeleccionado, setLoteSeleccionado] = useState(null);

  const cargarMovimientos = async () => {
    try {
      const res = await API.get('/movimientoinventario');
      setMovimientos(res.data);
    } catch {
      toast.error('Error al cargar movimientos');
    }
  };

  const cargarLotes = async () => {
    try {
      const res = await API.get('/lote');
      setLotes(res.data);
    } catch {
      toast.error('Error al cargar lotes');
    }
  };

  useEffect(() => {
    cargarMovimientos();
    cargarLotes();
  }, []);

  const openModalParaLote = (lote = null) => {
    setLoteSeleccionado(lote);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setLoteSeleccionado(null);
    setModalOpen(false);
  };

  const handleMovimientoGuardado = () => {
    cargarMovimientos();
    cargarLotes();
    handleCloseModal();
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-[#d2006e]">Movimientos de Inventario</h1>

      <button
        className="mb-6 px-4 py-2 rounded bg-[#d2006e] text-white hover:bg-[#a30058] transition duration-200"
        onClick={() => openModalParaLote(null)}
      >
        Nuevo Movimiento
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-[#f5d4e4] text-[#d2006e]">
              <th className="text-left p-3">Lote</th>
              <th className="text-left p-3">Producto</th>
              <th className="text-left p-3">Tipo Movimiento</th>
              <th className="text-left p-3">Cantidad Movimiento</th>
              <th className="text-left p-3">Cantidad Resultante</th>
              <th className="text-left p-3">Fecha</th>
              <th className="text-left p-3">Usuario</th>
              <th className="text-left p-3">Observacion</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.map((mov) => (
              <tr key={mov.id} className="border-t hover:bg-[#fce8f1]">
                <td className="p-3">{mov.lote?.numeroLote}</td>
                <td className="p-3">{mov.lote?.producto?.nombre}</td>
                <td className="p-3 capitalize">{mov.tipoMovimiento}</td>
                <td className="p-3">{mov.cantidadMovimiento}</td>
                <td className="p-3">{mov.cantidadResultante}</td>
                <td className="p-3">{new Date(mov.fechaMovimiento).toLocaleString()}</td>
                <td className="p-3">{mov.usuario?.usuario}</td>
                <td className="p-3">{mov.observacion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <MovimientoModal
          lotes={lotes}
          lote={loteSeleccionado}
          onClose={handleCloseModal}
          onMovimientoExitoso={handleMovimientoGuardado}
        />
      )}
    </div>
  );
}
