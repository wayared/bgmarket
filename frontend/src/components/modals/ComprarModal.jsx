import { useState } from 'react';
import { toast } from 'react-toastify';
import API from '../../api/axios';

export default function ComprarModal({ lote, onClose, onCompraExitosa }) {
  const [cantidadCompra, setCantidadCompra] = useState(1);
  const maxCantidad = lote.cantidad; // Cantidad disponible en el lote

  const handleCompra = async () => {
    if (cantidadCompra <= 0) {
      toast.error('La cantidad debe ser mayor a cero');
      return;
    }
    if (cantidadCompra > maxCantidad) {
      toast.error('Cantidad supera el stock disponible');
      return;
    }

    try {
      await API.post('/movimientoinventario', {
        loteId: lote.id,
        tipoMovimiento: 'salida',
        cantidadMovimiento: cantidadCompra,
        observacion: 'Compra de cliente',
      });
      toast.success('Compra realizada con éxito');
      onCompraExitosa();
      onClose();
    } catch (error) {
      toast.error('Error al registrar la compra');
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-[#d2006e]">Comprar: {lote.producto?.nombre}</h2>
        <p>Stock disponible: {maxCantidad}</p>
        <input
          type="number"
          min={1}
          max={maxCantidad}
          value={cantidadCompra}
          onChange={e => setCantidadCompra(Number(e.target.value))}
          className="border border-[#d2006e] p-2 w-full mb-4 rounded focus:ring focus:ring-[#d2006e]/50 focus:border-[#d2006e]"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition duration-200"
          >
            Cancelar
          </button>
          <button
            onClick={handleCompra}
            className="px-4 py-2 rounded bg-[#d2006e] text-white hover:bg-[#a50054] transition duration-200"
          >
            Confirmar Compra
          </button>
        </div>
      </div>
    </div>
  );
}
