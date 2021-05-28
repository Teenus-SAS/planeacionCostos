import { fetchData } from "../../../utils/fetchData";

export async function CalculateCostPerMinuteByProductoProcesoId(
  productoId,
  cantidad
) {
  return await fetchData("/app/cost/api/product_process_cost_per_minute.php", {
    method: "GET",
    body: {
      quantity: cantidad,
      idProducto: productoId,
    },
  });
}
