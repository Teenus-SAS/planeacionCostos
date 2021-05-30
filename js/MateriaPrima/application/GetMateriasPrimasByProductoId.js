import { fetchData } from "../../utils/fetchData.js";

export async function GetMateriasPrimasByProductoId(productoId) {
  return (
    await fetchData(
      "/app/config-general/api/get_materials_product.php?id=" + productoId
    )
  ).data;
}
