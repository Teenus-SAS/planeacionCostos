export function GetServiciosExternosByProductoId(productoId, cb) {
  $.get(
    "/app/products/api/get_servicio_externo_by_product_id.php?id=" + productoId,
    (servicios) => {
      cb(servicios);
    }
  );
}
