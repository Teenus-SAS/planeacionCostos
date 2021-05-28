import { fetchData } from "../../../utils/fetchData.js";

export async function GetAllNominas() {
  return await fetchData("/app/config-general/api/get_rosters.php");
}
