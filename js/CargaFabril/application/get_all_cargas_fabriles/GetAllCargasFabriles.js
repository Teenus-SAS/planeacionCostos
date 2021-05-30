import { fetchData } from "../../../utils/fetchData.js";

export async function GetAllCargasFabriles() {
  return (await fetchData("/app/config-general/api/get_carga_fabril.php")).data;
}
