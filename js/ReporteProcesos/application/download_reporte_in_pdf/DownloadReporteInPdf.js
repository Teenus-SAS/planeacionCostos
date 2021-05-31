import { jsPDF } from "../../../../node_modules/jspdf/dist/jspdf.es.js";

export async function DownloadReporteInPdf(
  productoId,
  cliente,
  ciudad,
  consecutivo,
  fecha
) {
  return new Promise(async (resolve, reject) => {
    let reportePdf = new jsPDF("p", "pt", "letter");

    reportePdf.setFontSize(14);
    $("#pdf-productos-selected").empty();
    $("#pdf-cotizacion-mano-obra").empty();
    $("#pdf-cotizacion-materias-primas").empty();
    $("#pdf-cotizacion-servicios-externos").empty();
    $("#pdf-cotizacion-consolidacion").empty();
    $("#pdf-productos-selected").append(
      $("#productos-selected-reporte-table").html()
    );

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
    $("#pdf-cotizacion-consolidacion-group").attr("hidden", false);
    $("#pdf-cotizacion-piepagina-group").attr("hidden", false);
    resolve(await download(consecutivo, fecha, reportePdf));
  });
}

async function download(consecutivo, fecha, reportePdf) {
  return new Promise((resolve, reject) => {
    if (!fecha) {
      const now = new Date();
      fecha = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    }
    const element = document.getElementById("pdf-first-page");

    let pWidth = reportePdf.internal.pageSize.width;
    let srcWidth = element.scrollWidth;
    let margin = 30;
    let scale = (pWidth - margin * 2) / srcWidth;
    $("#final_pdf_cotizacion").toggleClass("opacity-0");
    html2canvas(
      document.querySelector("#pdf-cotizacion-consolidacion-group")
    ).then(function (consolidadoCanvas) {
      html2canvas(
        document.querySelector("#pdf-cotizacion-piepagina-group")
      ).then(function (piePaginaCanvas) {
        addPiePagina(reportePdf, piePaginaCanvas);
        let consolidadoImageData = consolidadoCanvas.toDataURL(
          "image/png",
          1.0
        );
        $("#pdf-cotizacion-consolidacion-group").attr("hidden", "true");
        $("#pdf-cotizacion-piepagina-group").attr("hidden", "true");
        reportePdf.html(element, {
          x: margin,
          y: 15,
          html2canvas: {
            scale: scale,
          },
          callback: (doc) => {
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            const consolidadoWidthRatio = pageWidth / consolidadoCanvas.width;
            const consolidadoHeightRatio =
              pageHeight / consolidadoCanvas.height;
            const consolidadoRatio =
              consolidadoWidthRatio > consolidadoHeightRatio
                ? consolidadoHeightRatio
                : consolidadoWidthRatio;

            const consolidadoWidth =
              consolidadoCanvas.width * consolidadoRatio * 0.85;
            const consolidadoHeight =
              consolidadoCanvas.height * consolidadoRatio * 0.85;

            const marginX = (pageWidth - consolidadoWidth) / 2;
            newPage(doc, piePaginaCanvas);
            doc.addImage(
              consolidadoImageData,
              "PNG",
              marginX,
              50,
              consolidadoWidth,
              consolidadoHeight
            );

            doc.save(`Cotizacion_${consecutivo}_${fecha}.pdf`);
            $("#final_pdf_cotizacion").toggleClass("opacity-0");
            resolve(true);
          },
        });
      });
    });
  });
}

function newPage(doc, piePaginaCanvas = undefined) {
  doc.addPage();
  if (piePaginaCanvas) {
    addPiePagina(doc, piePaginaCanvas);
  }
}

function addPiePagina(doc, piePaginaCanvas) {
  const piepaginaImageData = piePaginaCanvas.toDataURL("image/png", 1.0);

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const piePaginaWidthRatio = pageWidth / piePaginaCanvas.width;
  const piePaginaHeightRatio = pageHeight / piePaginaCanvas.height;
  const piePaginaRatio =
    piePaginaWidthRatio > piePaginaHeightRatio
      ? piePaginaHeightRatio
      : piePaginaWidthRatio;

  const piePaginaWidth = piePaginaCanvas.width * piePaginaRatio;
  const piePaginaHeight = piePaginaCanvas.height * piePaginaRatio;
  doc.addImage(
    piepaginaImageData,
    "PNG",
    0,
    pageHeight - piePaginaHeight + 1,
    piePaginaWidth,
    piePaginaHeight
  );
}
