export function CalculateCostPerMinuteByProductoProcesoId(
  productoId,
  cantidad,
  cb
) {
  $.get(
    "/app/cost/api/product_process_cost_per_minute.php",
    {
      quantity: cantidad,
      idProducto: productoId,
    },
    (processesCost) => {
      cb(processesCost);
    }
  );
}
