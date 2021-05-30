import { fetchData } from "../../../utils/fetchData.js";

export async function GetAllProductos() {
  return (
    await fetchData(
      "/app/products/api/get_products.php?expenses=true&process=true&materials=true"
    )
  ).data;
}
