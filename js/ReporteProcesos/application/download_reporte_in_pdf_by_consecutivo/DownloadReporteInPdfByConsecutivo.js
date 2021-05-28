import { DownloadReporteInPdf } from "../download_reporte_in_pdf/DownloadReporteInPdf.js";
import { GetReporteProductoProcesosByConsecutivo } from "../get_reporte_by_consecutivo/GetReporteProductoProcesosByConsecutivo.js";

export async function DownloadReporteInPdfByConsecutivo(consecutivo) {
  const reporte = await GetReporteProductoProcesosByConsecutivo(consecutivo);

  if (reporte) {
    DownloadReporteInPdf(
      reporte.productos,
      reporte.cliente,
      reporte.ciudad,
      consecutivo,
      reporte.creationDate
    );
  }
}
