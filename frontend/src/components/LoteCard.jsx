import { Pencil } from 'lucide-react';

export default function LoteCard({ lote, onEdit, onDelete }) {
  return (
    <div className="bg-white p-4 shadow rounded relative">
      <h3 className="text-lg font-semibold">{lote.producto?.nombre || 'Producto sin nombre'}</h3>
      <p className="text-gray-600">{lote.producto?.descripcion || 'Sin descripción'}</p>
      <p className="text-green-700 font-bold mt-2">${lote.precio.toFixed(2)}</p>
      <div className="absolute top-2 right-2 flex gap-2">
        <button onClick={onDelete} className="text-red-500 hover:text-red-700">🗑️</button>
        <button onClick={onEdit} className="text-blue-500 hover:text-blue-700">
          <Pencil size={18} />
        </button>
      </div>
    </div>
  );
}
