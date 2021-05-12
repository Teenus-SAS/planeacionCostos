import { DownloadReporteInPdf } from "../../../application/download_reporte_in_pdf/DownloadReporteInPdf.js";
import { NewReporteProductoProcesos } from "../../../application/new_reporte_producto_procesos/NewReporteProductoProcesos.js";

export function OnClickDescargarReporteProductoProcesoButton(buttonData, cb) {
  NewReporteProductoProcesos(
    buttonData.consecutivo,
    buttonData.cliente,
    buttonData.ciudad,
    buttonData.productoId,
    buttonData.cantidad,
    buttonData.pdfdata,
    () => {
      $.notify(
        {
          icon: "nc-icon nc-bell-55",
          message: `Reporte creado correctamente`,
        },
        {
          type: "success",
          timer: 2500,
        }
      );
      cb();
      DownloadReporteInPdf(
        buttonData.productoId,
        buttonData.cliente,
        buttonData.ciudad,
        buttonData.consecutivo
      );
    },
    (errors) => {
      const error = errors[0];
      $.notify(
        {
          icon: "nc-icon nc-bell-55",
          message: error,
        },
        {
          type: "danger",
          timer: 5000,
        }
      );
    }
  );
}