import { CreateReporteProductoProcesos } from "../../../application/create_reporte_producto_procesos/CreateReporteProductoProcesos.js";
import { DownloadReporteInPdf } from "../../../application/download_reporte_in_pdf/DownloadReporteInPdf.js";

export function OnClickDescargarReporteProductoProcesoButton(buttonData, cb) {
  CreateReporteProductoProcesos(
    buttonData.consecutivo,
    buttonData.cliente,
    buttonData.ciudad,
    buttonData.productos,
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
