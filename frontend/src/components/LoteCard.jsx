import { Pencil, Trash2 } from 'lucide-react'; 

// src/components/LoteCard.jsx
export default function LoteCard({ lote, onEdit, onDelete }) {
  return (
    <div className="bg-white p-4 shadow rounded relative">
      <h3 className="text-lg font-semibold">{lote.producto?.nombre || 'Producto sin nombre'}</h3>
      <p className="text-gray-600">{lote.producto?.descripcion || 'Sin descripción'}</p>
      <p className="text-[#d2006e] font-bold mt-2">${lote.precio.toFixed(2)}</p>
      <p className="text-gray-700 mt-1">Cantidad: {lote.cantidad}</p>
      <div className="absolute top-2 right-2 flex gap-2">
        <button
          onClick={onDelete}
          className="text-[#d2006e] hover:text-[#a30058]"
          aria-label="Eliminar lote"
          title="Eliminar lote"
        >
          <Trash2 size={18} />
        </button>
        <button
          onClick={onEdit}
          className="text-[#d2006e] hover:text-[#a30058]"
          aria-label="Editar lote"
          title="Editar lote"
        >
          <Pencil size={18} />
        </button>
      </div>
    </div>
  );
}
