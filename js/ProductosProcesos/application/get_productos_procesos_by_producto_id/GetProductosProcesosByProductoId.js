import { fetchData } from "../../../utils/fetchData.js";

export async function GetProductosProcesosByProductoId(productoId) {
  return (
    await fetchData("/app/products/api/get_product_processes.php", {
      body: { id: productoId },
    })
  ).data;
}
