import { fetchData } from "../../../utils/fetchData.js";

export async function GetServiciosExternosByProductoId(productoId) {
  return await fetchData(
    "/app/products/api/get_servicio_externo_by_product_id.php?id=" + productoId
  );
}
