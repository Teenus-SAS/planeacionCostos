import { GetReporteProductoProcesosByConsecutivo } from "../../../application/get_reporte_by_consecutivo/GetReporteProductoProcesosByConsecutivo.js";

export async function OnClickViewReporteProductoProceso(consecutivo) {
  const reporte = await GetReporteProductoProcesosByConsecutivo(consecutivo);
  return {
    pdfData: JSON.parse(reporte.pdfData),
    consecutivo: reporte.consecutivo,
    cliente: reporte.cliente,
    ciudad: reporte.ciudad,
    productos: JSON.parse(reporte.productos),
  };
}
