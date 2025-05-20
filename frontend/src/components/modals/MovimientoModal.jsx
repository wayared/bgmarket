import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../../api/axios';

export default function MovimientoModal({ lote, lotes, onClose, onMovimientoExitoso }) {
  const [loteSeleccionado, setLoteSeleccionado] = useState(lote || null);
  const [tipoMovimiento, setTipoMovimiento] = useState('entrada');
  const [cantidad, setCantidad] = useState(1);
  const [observacion, setObservacion] = useState('');
  const maxCantidad = loteSeleccionado?.cantidad ?? 0;

  // Actualiza loteSeleccionado si cambia el prop lote
  useEffect(() => {
    setLoteSeleccionado(lote || null);
  }, [lote]);

  const handleSubmit = async () => {
    if (!loteSeleccionado) {
      toast.error('Debe seleccionar un lote');
      return;
    }

    if (cantidad <= 0) {
      toast.error('La cantidad debe ser mayor a cero');
      return;
    }

    if (tipoMovimiento === 'salida' && cantidad > maxCantidad) {
      toast.error('Cantidad supera el stock disponible');
      return;
    }

    try {
      await API.post('/movimientoinventario', {
        loteId: loteSeleccionado.id,
        tipoMovimiento,
        cantidadMovimiento: cantidad,
        observacion: observacion || (tipoMovimiento === 'entrada' ? 'Reposición de stock' : 'Salida de stock')
      });

      toast.success('Movimiento registrado con éxito');
      onMovimientoExitoso();
      onClose();
    } catch (error) {
      toast.error('Error al registrar movimiento');
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Movimiento de Inventario</h2>

        {/* Select lote (solo si no viene lote por prop) */}
        {!lote && (
          <label className="block mb-4">
            Seleccionar Lote:
            <select
              className="w-full border rounded p-2 mt-1"
              value={loteSeleccionado?.id || ''}
              onChange={e => {
                const seleccionado = lotes.find(l => l.id === parseInt(e.target.value));
                setLoteSeleccionado(seleccionado || null);
                setCantidad(1);
              }}
            >
              <option value="">-- Seleccione un lote --</option>
              {lotes.map(l => (
                <option key={l.id} value={l.id}>
                  {l.numeroLote} - {l.producto?.nombre} (Stock: {l.cantidad})
                </option>
              ))}
            </select>
          </label>
        )}

        {/* Tipo de movimiento */}
        <label className="block mb-4">
          Tipo de movimiento:
          <select
            className="w-full border rounded p-2 mt-1"
            value={tipoMovimiento}
            onChange={e => setTipoMovimiento(e.target.value)}
          >
            <option value="entrada">Entrada (Reposición)</option>
            <option value="salida">Salida (Venta)</option>
          </select>
        </label>

        {/* Cantidad */}
        <label className="block mb-4">
          Cantidad:
          <input
            type="number"
            min={1}
            max={tipoMovimiento === 'salida' ? maxCantidad : undefined}
            value={cantidad}
            onChange={e => setCantidad(Number(e.target.value))}
            className="w-full border rounded p-2 mt-1"
          />
        </label>

        {/* Observación */}
        <label className="block mb-4">
          Observación:
          <textarea
            value={observacion}
            onChange={e => setObservacion(e.target.value)}
            className="w-full border rounded p-2 mt-1"
            placeholder="Opcional"
          />
        </label>

        {tipoMovimiento === 'salida' && loteSeleccionado && (
          <p className="text-sm text-gray-600 mb-4">Stock disponible: {maxCantidad}</p>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-[#d2006e] text-white hover:bg-[#a30058] transition duration-200"
          >
            Registrar Movimiento
          </button>
        </div>
      </div>
    </div>
  );
}
