import { fetchData } from "../../../utils/fetchData.js";

export async function DeleteReporteProductoProcesoByConsecutivo(consecutivo) {
  return (
    await fetchData(
      "/app/reportes/api/delete_reportes_costeos_procesos_by_consecutivo.php",
      { method: "POST", body: { consecutivo } }
    )
  ).data;
}
