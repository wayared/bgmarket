import { useEffect, useRef } from 'react';

export default function MenuDropdown({ menuOpen, setMenuOpen, setModalType, setProductoEdit }) {
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setMenuOpen]);

  if (!menuOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute mt-2 w-60 bg-white border rounded shadow z-50"
    >
      <p className="text-xs text-blue-600 font-bold px-4 pt-3">Acciones</p>
      <ul className="text-gray-800">
        <li className="hover:bg-gray-100 px-4 py-2 cursor-pointer"
            onClick={() => { setProductoEdit(null); setModalType('producto'); setMenuOpen(false); }}>
          Nuevo Producto
        </li>
        <li className="hover:bg-gray-100 px-4 py-2 cursor-pointer"
            onClick={() => { setModalType('lote'); setMenuOpen(false); }}>
          Nuevo Lote
        </li>
        <li className="hover:bg-gray-100 px-4 py-2 cursor-pointer"
            onClick={() => { setModalType('categoria'); setMenuOpen(false); }}>
          Nueva Categoría
        </li>
      </ul>
    </div>
  );
}
