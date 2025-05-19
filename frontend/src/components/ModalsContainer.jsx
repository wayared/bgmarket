import ModalProducto from './modals/ModalProducto';
import ModalLote from './modals/ModalLote';
import ModalCategoria from './modals/ModalCategoria';

export default function ModalsContainer({
  modalType, setModalType,
  productoEdit, setProductoEdit,
  categorias, productos,
  recargarLotes, recargarCategorias
}) {
  return (
    <>
      {modalType === 'producto' && (
        <ModalProducto
          onClose={() => { setModalType(null); setProductoEdit(null); }}
          categorias={categorias}
          recargar={recargarLotes}
          productoEdit={productoEdit}
        />
      )}
      {modalType === 'lote' && (
        <ModalLote
          onClose={() => setModalType(null)}
          productos={productos}
          recargar={recargarLotes}
        />
      )}
      {modalType === 'categoria' && (
        <ModalCategoria
          onClose={() => setModalType(null)}
          recargar={recargarCategorias}
        />
      )}
    </>
  );
}
