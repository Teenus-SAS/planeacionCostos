import { fetchData } from "../../../utils/fetchData";

export function GetAllMaquinas() {
  return (await fetchData("/app/config-general/api/get_machines.php")).data;
}
