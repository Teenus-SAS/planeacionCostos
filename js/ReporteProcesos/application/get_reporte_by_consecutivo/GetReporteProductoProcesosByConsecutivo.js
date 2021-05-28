import { fetchData } from "../../../utils/fetchData.js";

export async function GetReporteProductoProcesosByConsecutivo(consecutivo) {
  return await fetchData(
    "/app/reportes/api/get_reporte_costeo_procesos_by_consecutivo.php",
    {
      body: {
        consecutivo,
      },
    }
  );
}
