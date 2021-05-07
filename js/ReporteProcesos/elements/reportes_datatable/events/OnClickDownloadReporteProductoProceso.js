import { DownloadReporteInPdfByConsecutivo } from "../../../application/download_reporte_in_pdf_by_consecutivo/DownloadReporteInPdfByConsecutivo.js";
import { GetReporteProductoProcesosByConsecutivo } from "../../../application/get_reporte_by_consecutivo/GetReporteProductoProcesosByConsecutivo.js";
import { IndividualReporteProductoProcesoDataTable } from "../../individual_reporte_datatable/IndividualReporteProductoProcesoDataTable.js";

export function OnClickDownloadReporteProductoProceso(consecutivo, cb) {
  GetReporteProductoProcesosByConsecutivo(consecutivo, (reporte) => {
    const table = new IndividualReporteProductoProcesoDataTable([], {});
    table.fromJSON("reporte-procesos-table", reporte.pdfData);
    DownloadReporteInPdfByConsecutivo(consecutivo);
    cb();
  });
}
