import { jsPDF } from "../../../../node_modules/jspdf/dist/jspdf.es.js";

export function DownloadReporteInPdf(
  productoId,
  cliente,
  ciudad,
  consecutivo,
  fecha
) {
  let reportePdf = new jsPDF("p", "pt", "letter");
  const title = "Reporte";

  /*reportePdf.text(title, 300, 50, {
    align: "center",
  });*/
  reportePdf.setFontSize(14);
  /*reportePdf.text(
    [
      `# Consecutivo: ${consecutivo}`,
      `Cliente: ${cliente}`,
      `Ciudad: ${ciudad}`,
    ],
    50,
    120,
    {}
  );*/
  reportePdf.setFontSize(12);
  $("#pdf-cotizacion-mano-obra").append($("#reporte-procesos-table").html());
  $("#pdf-cotizacion-materias-primas").append(
    $("#materias-reporte-procesos-table").html()
  );
  $("#pdf-cotizacion-servicios-externos").append(
    $("#servicios-externos-reporte-procesos-table").html()
  );
  $("#pdf-cotizacion-consolidacion").append(
    $("#costeo-reporte-procesos-table").html()
  );
  download(consecutivo, fecha, reportePdf);
}

function download(consecutivo, fecha, reportePdf) {
  if (!fecha) {
    const now = new Date();
    fecha = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  }
  const element = document.getElementById("final_pdf_cotizacion");

  let pWidth = reportePdf.internal.pageSize.width;
  let srcWidth = element.scrollWidth;
  let margin = 18;
  let scale = (pWidth - margin * 2) / srcWidth;
  reportePdf.html(element, {
    x: margin,
    y: margin,
    html2canvas: {
      scale: scale,
    },
    callback: (doc) => {
      doc.save(`Cotizacion_${consecutivo}_${fecha}.pdf`);
    },
  });
}
