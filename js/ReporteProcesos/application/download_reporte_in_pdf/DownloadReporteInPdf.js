import { GetServiciosExternosByProductoId } from "../../../ServiciosExternos/application/get_by_producto_id/GetServiciosExternosByProductoId.js";

export function DownloadReporteInPdf(productoId, cliente, ciudad, consecutivo) {
  let reportePdf = new jsPDF("p", "pt", "letter");
  const title = "Reporte";

  GetServiciosExternosByProductoId(productoId, (servicios) => {
    let serviciosExternosCosto = 0;
    if (servicios) {
      serviciosExternosCosto = servicios.reduce((total, servicio) => {
        return total + parseFloat(servicio.costo);
      }, 0);
    }
    reportePdf.text(title, 300, 50, {
      align: "center",
    });
    reportePdf.text(
      [
        `# Consecutivo: ${consecutivo}`,
        `Cliente: ${cliente}`,
        `Ciudad: ${ciudad}`,
      ],
      50,
      120,
      {}
    );
    reportePdf.autoTable({
      html: "#reporte-procesos-table table",
      startY: 200,
      theme: "grid",
    });
    reportePdf.text(
      `Servicios Externos: ${
        PriceParser.toString(serviciosExternosCosto, true).strPrice
      }`,
      50,
      500,
      {}
    );
    reportePdf.save();
  });
}
