import { GetProductoById } from "../../../Productos/application/get_producto_by_id/GetProductoById.js";
import { PDF } from "../../../Shared/infrastructure/PDF.js";
import { PDFProductosSelectedData } from "../../elements/pdf_productos_selected_datatable/data/PDFProductosSelectedData.js";
import { PDFProductosSelectedDataTable } from "../../elements/pdf_productos_selected_datatable/PDFProductosSelectedDataTable.js";

export async function DownloadReporteInPdf(
  productos,
  cliente,
  ciudad,
  consecutivo,
  fecha
) {
  return new Promise(async (resolve, reject) => {
    $("#pdf-cotizacion-mano-obra").empty();
    $("#pdf-cotizacion-materias-primas").empty();
    $("#pdf-cotizacion-servicios-externos").empty();
    $("#pdf-cotizacion-consolidacion").empty();

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
    resolve(await download(consecutivo, fecha, productos));
  });
}

async function download(consecutivo, fecha, productos) {
  return new Promise(async (resolve, reject) => {
    if (!fecha) {
      const now = new Date();
      fecha = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    }
    const piePaginaCanvas = await html2canvas(
      document.querySelector("#pdf-cotizacion-piepagina-group")
    );
    const reportePdf = new PDF(piePaginaCanvas);

    $("#final_pdf_cotizacion").toggleClass("opacity-0");

    const productosMapped = [];
    for await (const productoId of Object.keys(productos)) {
      const producto = await GetProductoById(productoId);
      if (producto) {
        productosMapped.push(
          new PDFProductosSelectedData(
            producto.ref,
            producto.name,
            productos[productoId].cantidad,
            producto.rentabilidad,
            productos[productoId].recuperacion
          )
        );
      }
    }

    $("#pdf-productos-selected").attr("hidden", false);
    new PDFProductosSelectedDataTable(productosMapped, {});
    await reportePdf.printCanvas(
      document.getElementById("pdf-productos-selected")
    );
    $("#pdf-productos-selected").attr("hidden", "true");

    reportePdf.addPage();
    $("#pdf-cotizacion-consolidacion-group").attr("hidden", "true");
    $("#pdf-cotizacion-piepagina-group").attr("hidden", "true");
    await reportePdf.printCanvas(document.getElementById("pdf-first-page"));

    reportePdf.addPage();
    $("#pdf-cotizacion-consolidacion-group").attr("hidden", false);
    $("#pdf-cotizacion-piepagina-group").attr("hidden", false);
    await reportePdf.printCanvas(
      document.querySelector("#pdf-cotizacion-consolidacion-group")
    );

    reportePdf.save(`Cotizacion_${consecutivo}_${fecha}.pdf`);
    $("#final_pdf_cotizacion").toggleClass("opacity-0");
    resolve(true);
  });
}
