import { DownloadReporteInPdf } from "../download_reporte_in_pdf/DownloadReporteInPdf.js";
import { GetReporteProductoProcesosByConsecutivo } from "../get_reporte_by_consecutivo/GetReporteProductoProcesosByConsecutivo.js";

export function DownloadReporteInPdfByConsecutivo(consecutivo) {
  GetReporteProductoProcesosByConsecutivo(consecutivo, (reporte) => {
    if (reporte) {
      DownloadReporteInPdf(
        reporte.producto.id,
        reporte.cliente,
        reporte.ciudad,
        consecutivo
      );
    }
  });
}
