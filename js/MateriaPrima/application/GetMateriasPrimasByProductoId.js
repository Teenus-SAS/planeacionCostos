export function GetMateriasPrimasByProductoId(productoId, cb) {
  $.get(
    "/app/config-general/api/get_materials_product.php?id=" + productoId,
    (materias) => {
      cb(materias);
    }
  );
}
