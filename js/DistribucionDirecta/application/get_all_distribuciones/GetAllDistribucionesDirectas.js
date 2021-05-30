import { fetchData } from "../../../utils/fetchData.js";

export async function GetAllDistribucionesDirectas() {
  return await (
    await fetchData("/app/products/api/get_distribuciones_directas.php")
  ).data;
}
