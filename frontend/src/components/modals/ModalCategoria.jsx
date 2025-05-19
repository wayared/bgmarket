import { useState } from 'react';
import API from '../../api/axios';
import { toast } from 'react-toastify';

export default function ModalCategoria({ onClose, recargar }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handleSubmit = async () => {
    try {
      await API.post('/categoria', { nombre, descripcion });
      toast.success('Categoría creada con éxito');
      recargar();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Categoría ya existente');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-[#d2006e]">Nueva Categoría</h2>
        <input
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          placeholder="Nombre de categoría"
          className="border border-[#d2006e] p-2 w-full mb-2 focus:ring focus:ring-[#d2006e]/50 focus:border-[#d2006e] rounded"
        />
        <input
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
          placeholder="Descripción"
          className="border border-[#d2006e] p-2 w-full mb-4 focus:ring focus:ring-[#d2006e]/50 focus:border-[#d2006e] rounded"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
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
