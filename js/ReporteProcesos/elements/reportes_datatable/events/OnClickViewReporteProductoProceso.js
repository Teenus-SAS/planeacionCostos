import { GetReporteProductoProcesosByConsecutivo } from "../../../application/get_reporte_by_consecutivo/GetReporteProductoProcesosByConsecutivo.js";

export function OnClickViewReporteProductoProceso(consecutivo, cb) {
  GetReporteProductoProcesosByConsecutivo(consecutivo, (reporte) => {
    cb(reporte.pdfData, reporte.consecutivo, reporte.cliente, reporte.ciudad);
  });
}
