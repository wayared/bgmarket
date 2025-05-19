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
      toast.error('Error al crear categoría');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Nueva Categoría</h2>
        <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre de categoría" className="border p-2 w-full mb-2" />
        <input value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Descripción" className="border p-2 w-full mb-4" />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-300">Cancelar</button>
          <button onClick={handleSubmit} className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">Guardar</button>
        </div>
      </div>
    </div>
  );
}
