import { useEffect, useState } from 'react';
import API from '../api/axios';

export default function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');

  const cargarProductos = () => {
    API.get('/producto')
      .then(res => setProductos(res.data))
      .catch(() => alert('Error al cargar productos'));
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const crearProducto = async () => {
    try {
      await API.post('/producto', { nombre, descripcion, precio: parseFloat(precio) });
      setNombre(''); setDescripcion(''); setPrecio('');
      cargarProductos();
    } catch {
      alert('Error al crear producto');
    }
  };

  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Eliminar este producto?")) return;
    try {
      await API.delete(`/producto/${id}`);
      cargarProductos();
    } catch {
      alert('Error al eliminar producto');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-green-700">Gestión de Productos</h1>

      {/* Formulario */}
      <div className="bg-white p-4 shadow rounded mb-6">
        <h2 className="text-lg font-semibold mb-2">Nuevo Producto</h2>
        <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre" className="border p-2 w-full mb-2" />
        <input value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Descripción" className="border p-2 w-full mb-2" />
        <input type="number" value={precio} onChange={e => setPrecio(e.target.value)} placeholder="Precio" className="border p-2 w-full mb-2" />
        <button onClick={crearProducto} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Crear</button>
      </div>

      {/* Lista */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productos.map(prod => (
          <div key={prod.id} className="bg-white p-4 shadow rounded relative">
            <h3 className="text-lg font-semibold">{prod.nombre}</h3>
            <p className="text-gray-600">{prod.descripcion}</p>
            <p className="text-green-700 font-bold mt-2">${prod.precio}</p>
            <button onClick={() => eliminarProducto(prod.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">🗑️</button>
          </div>
        ))}
      </div>
    </div>
  );
}
