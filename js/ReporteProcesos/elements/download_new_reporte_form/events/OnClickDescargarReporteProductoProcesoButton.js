import { Notifications } from "../../../../Shared/infrastructure/Notifications.js";
import { CreateReporteProductoProcesos } from "../../../application/create_reporte_producto_procesos/CreateReporteProductoProcesos.js";
import { DownloadReporteInPdf } from "../../../application/download_reporte_in_pdf/DownloadReporteInPdf.js";

export async function OnClickDescargarReporteProductoProcesoButton(
  buttonData,
  successcb
) {
  const reporteCreated = await CreateReporteProductoProcesos(
    buttonData.consecutivo,
    buttonData.cliente,
    buttonData.ciudad,
    buttonData.productos,
    buttonData.cantidad,
    buttonData.pdfdata
  );

  if (!reporteCreated.error) {
    Notifications.success(`Reporte creado correctamente`);
    await DownloadReporteInPdf(
      buttonData.productos,
      buttonData.cliente,
      buttonData.ciudad,
      buttonData.consecutivo
    );
    successcb();
  } else {
    Notifications.error(reporteCreated.error);
  }
}
