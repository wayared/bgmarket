import { useEffect, useState } from 'react';
import API from '../../api/axios';
import { toast } from 'react-toastify';

export default function ModalProducto({ onClose, categorias, recargar, productoEdit }) {
  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [unidadMedida, setUnidadMedida] = useState('');
  const [categoriaId, setCategoriaId] = useState('');

  useEffect(() => {
    if (productoEdit) {
      setCodigo(productoEdit.codigo || '');
      setNombre(productoEdit.nombre || '');
      setDescripcion(productoEdit.descripcion || '');
      setUnidadMedida(productoEdit.unidadMedida || '');
      setCategoriaId(productoEdit.categoria?.id || productoEdit.categoriaId || '');
    } else {
      setCodigo('');
      setNombre('');
      setDescripcion('');
      setUnidadMedida('');
      setCategoriaId('');
    }
  }, [productoEdit]);

  const handleSubmit = async () => {
    try {
      const data = {
        codigo,
        nombre,
        descripcion,
        unidadMedida,
        categoriaId: parseInt(categoriaId),
      };

      if (productoEdit) {
        await API.put(`/producto/${productoEdit.id}`, { ...data, id: productoEdit.id, activo: productoEdit.activo });
        toast.success('Producto actualizado con éxito');
      } else {
        await API.post('/producto', data);
        toast.success('Producto creado con éxito');
      }

      recargar();
      onClose();
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error('Error al guardar producto');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {productoEdit ? 'Editar Producto' : 'Nuevo Producto'}
        </h2>
        <input
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="Código"
          className="border p-2 w-full mb-2"
        />
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre"
          className="border p-2 w-full mb-2"
        />
        <input
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Descripción"
          className="border p-2 w-full mb-2"
        />
        <input
          value={unidadMedida}
          onChange={(e) => setUnidadMedida(e.target.value)}
          placeholder="Unidad de medida"
          className="border p-2 w-full mb-2"
        />
        <select
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value)}
          className="border p-2 w-full mb-4"
        >
          <option value="">Seleccionar Categoría</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-300">
            Cancelar
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}