import { Pencil, Trash2 } from 'lucide-react'; // Importamos los iconos de edición y eliminación

export default function LoteCard({ lote, onEdit, onDelete, esAdmin = true }) {
  return (
    <div className="bg-white p-4 shadow rounded relative">
      <h3 className="text-lg font-semibold">{lote.producto?.nombre || 'Producto sin nombre'}</h3>
      <p className="text-gray-600">{lote.producto?.descripcion || 'Sin descripción'}</p>
      <p className="text-[#d2006e] font-bold mt-2">${lote.precio.toFixed(2)}</p>
      <p className="text-gray-700 mt-1">Cantidad en Stock: {lote.cantidad}</p>

      {/* Mostrar los botones de editar y eliminar solo si es la vista de administración */}
      {esAdmin && (
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
      )}
    </div>
  );
}
