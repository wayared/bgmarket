import React from 'react';

export default function Pagination({ paginaActual, totalPaginas, onChangePagina }) {
  if (totalPaginas === 0) return null;

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina < 1 || nuevaPagina > totalPaginas) return;
    onChangePagina(nuevaPagina);
  };

  return (
    <div className="flex flex-col items-center mt-6 space-y-2">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => cambiarPagina(paginaActual - 1)}
          disabled={paginaActual === 1}
          className="px-3 py-1 rounded bg-[#d2006e] text-white disabled:opacity-50"
        >
          Anterior
        </button>
        {[...Array(totalPaginas).keys()].map(num => (
          <button
            key={num + 1}
            onClick={() => cambiarPagina(num + 1)}
            className={`px-3 py-1 rounded ${
              paginaActual === num + 1
                ? 'bg-[#a30058] text-white'
                : 'bg-[#f5d4e4] text-[#d2006e]'
            }`}
          >
            {num + 1}
          </button>
        ))}
        <button
          onClick={() => cambiarPagina(paginaActual + 1)}
          disabled={paginaActual === totalPaginas}
          className="px-3 py-1 rounded bg-[#d2006e] text-white disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
      <div className="text-[#d2006e] font-semibold">
        Página {paginaActual} de {totalPaginas || 1}
      </div>
    </div>
  );
}
