import { useEffect, useState } from 'react';
import API from '../api/axios';

export default function ClienteProductos() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    API.get('/producto')
      .then(res => setProductos(res.data))
      .catch(() => alert('Error al cargar productos'));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">Catálogo de Productos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {productos.map(prod => (
          <div key={prod.id} className="bg-white shadow rounded p-4">
            <h2 className="text-lg font-semibold">{prod.nombre}</h2>
            <p className="text-gray-600">{prod.descripcion}</p>
            <p className="text-blue-600 font-bold mt-2">${prod.precio}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
