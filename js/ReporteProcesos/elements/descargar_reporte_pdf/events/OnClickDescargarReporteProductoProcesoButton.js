import { DownloadReporteInPdf } from "../../../application/download_reporte_in_pdf/DownloadReporteInPdf.js";
import { NewReporteProductoProcesos } from "../../../application/new_reporte_producto_procesos/NewReporteProductoProcesos.js";

export function OnClickDescargarReporteProductoProcesoButton(buttonData) {
  NewReporteProductoProcesos(
    buttonData.consecutivo,
    buttonData.cliente,
    buttonData.ciudad,
    buttonData.productoId,
    buttonData.cantidad,
    () => {
      DownloadReporteInPdf(
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
