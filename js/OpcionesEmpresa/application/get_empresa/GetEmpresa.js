import { fetchData } from "../../../utils/fetchData.js";

export async function GetEmpresa() {
  return (await fetchData("/app/my-profile/api/get_company.php")).data.company;
}
