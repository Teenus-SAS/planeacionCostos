export function GetProductosProcesosByProductoId(productoId, cb) {
  $.get(
    "/app/products/api/get_product_processes.php",
    { id: productoId },
    (_productsProcesses, status) => {
      if (_productsProcesses) {
        cb(_productsProcesses);
      }
    }
  );
}
