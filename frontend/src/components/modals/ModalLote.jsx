import { useState } from 'react';
import API from '../../api/axios';
import { toast } from 'react-toastify';

export default function ModalLote({ onClose, productos, recargar }) {
  const [numeroLote, setNumeroLote] = useState('');
  const [fechaIngreso, setFechaIngreso] = useState('');
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [precio, setPrecio] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [productoId, setProductoId] = useState('');

  const handleSubmit = async () => {
    try {
      const tokenPayload = JSON.parse(atob(localStorage.getItem('token').split('.')[1]));
      const usuarioId = parseInt(tokenPayload.id);

      await API.post('/lote', {
        numeroLote,
        fechaIngreso,
        fechaVencimiento,
        precio: parseFloat(precio),
        cantidad: parseInt(cantidad),
        ubicacion,
        usuarioIngresoId: usuarioId,
        productoId: parseInt(productoId)
      });

      toast.success('Lote creado con éxito');
      recargar();
      onClose();
    } catch {
      toast.error('Error al crear lote');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-[#d2006e]">Nuevo Lote</h2>
        <input
          value={numeroLote}
          onChange={e => setNumeroLote(e.target.value)}
          placeholder="Número de lote"
          className="border border-[#d2006e] p-2 w-full mb-2 rounded focus:ring focus:ring-[#d2006e]/50 focus:border-[#d2006e]"
        />
        <input
          type="date"
          value={fechaIngreso}
          onChange={e => setFechaIngreso(e.target.value)}
          className="border border-[#d2006e] p-2 w-full mb-2 rounded focus:ring focus:ring-[#d2006e]/50 focus:border-[#d2006e]"
        />
        <input
          type="date"
          value={fechaVencimiento}
          onChange={e => setFechaVencimiento(e.target.value)}
          className="border border-[#d2006e] p-2 w-full mb-2 rounded focus:ring focus:ring-[#d2006e]/50 focus:border-[#d2006e]"
        />
        <input
          type="number"
          value={precio}
          onChange={e => setPrecio(e.target.value)}
          placeholder="Precio"
          className="border border-[#d2006e] p-2 w-full mb-2 rounded focus:ring focus:ring-[#d2006e]/50 focus:border-[#d2006e]"
        />
        <input
          type="number"
          value={cantidad}
          onChange={e => setCantidad(e.target.value)}
          placeholder="Cantidad"
          className="border border-[#d2006e] p-2 w-full mb-2 rounded focus:ring focus:ring-[#d2006e]/50 focus:border-[#d2006e]"
        />
        <input
          value={ubicacion}
          onChange={e => setUbicacion(e.target.value)}
          placeholder="Ubicación"
          className="border border-[#d2006e] p-2 w-full mb-2 rounded focus:ring focus:ring-[#d2006e]/50 focus:border-[#d2006e]"
        />
        <select
          value={productoId}
          onChange={e => setProductoId(e.target.value)}
          className="border border-[#d2006e] p-2 w-full mb-4 rounded focus:ring focus:ring-[#d2006e]/50 focus:border-[#d2006e]"
        >
          <option value="">Seleccionar Producto</option>
          {productos.map(prod => <option key={prod.id} value={prod.id}>{prod.nombre}</option>)}
        </select>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition duration-200"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-[#d2006e] text-white hover:bg-[#a50054] transition duration-200"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
