import { DownloadReporteInPdfByConsecutivo } from "../../../application/download_reporte_in_pdf_by_consecutivo/DownloadReporteInPdfByConsecutivo.js";
import { GetReporteProductoProcesosByConsecutivo } from "../../../application/get_reporte_by_consecutivo/GetReporteProductoProcesosByConsecutivo.js";
import { CosteosIndividualReporteProductoProcesoDataTable } from "../../individual_reporte/costeos_individual_reporte_datatable/CosteosIndividualReporteProductoProcesoDataTable.js";
import { IndividualReporteProductoProcesoDataTable } from "../../individual_reporte/individual_reporte_datatable/IndividualReporteProductoProcesoDataTable.js";
import { MateriasIndividualReporteProductoProcesoDataTable } from "../../individual_reporte/materias_individual_reporte_datatable/MateriasIndividualReporteProductoProcesoDataTable.js";
import { ServiciosExternosIndividualReporteProductoProcesoDataTable } from "../../individual_reporte/serviciosexternos_individual_reporte_datatable/ServiciosExternosIndividualReporteProductoProcesoDataTable.js";

export function OnClickDownloadReporteProductoProceso(consecutivo, cb) {
  GetReporteProductoProcesosByConsecutivo(consecutivo, (reporte) => {
    const procesos = new IndividualReporteProductoProcesoDataTable(
      "reporte-procesos-table",
      [],
      {}
    );
    const materiasIndividualReporteDataTable =
      new MateriasIndividualReporteProductoProcesoDataTable(
        "materias-reporte-procesos-table",
        [],
        {}
      );
    const serviciosExternosIndividualReporteDataTable =
      new ServiciosExternosIndividualReporteProductoProcesoDataTable(
        "servicios-externos-reporte-procesos-table",
        [],
        {}
      );
    const costeosIndividualReporteDataTable =
      new CosteosIndividualReporteProductoProcesoDataTable(
        "costeo-reporte-procesos-table",
        [],
        {}
      );
    const pdfData = JSON.parse(reporte.pdfData);

    procesos.fromJSON(JSON.stringify(pdfData.main));
    serviciosExternosIndividualReporteDataTable.fromJSON(
      JSON.stringify(pdfData.servicios)
    );
    materiasIndividualReporteDataTable.fromJSON(
      JSON.stringify(pdfData.materias)
    );
    costeosIndividualReporteDataTable.fromJSON(JSON.stringify(pdfData.costeos));
    DownloadReporteInPdfByConsecutivo(consecutivo);
    cb();
  });
}
