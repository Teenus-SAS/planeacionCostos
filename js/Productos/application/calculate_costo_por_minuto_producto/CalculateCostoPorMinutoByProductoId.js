export function CalculateCostoPorMinutoByProductoId(productoId, cantidad, cb) {
  $.get(
    "/app/cost/api/cost_product.php",
    { id: productoId, quantity: cantidad },
    (cost) => {
      if (cost) {
        cb(cost.generalExpenses);
      }
    }
  );
}
