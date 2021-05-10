import { fillSelect } from "../utils/fillSelect.js";
import { GetAllProductos } from "../Productos/application/get_all_productos/GetAllProductos.js";
import { ReporteProductoProcesoDataTable } from "./elements/reportes_datatable/ReporteProductoProcesoDataTable.js";
import { GenerateReporteProductoProcesoButton } from "./elements/ver_reporte_button/GenerateReporteProductoProcesoButton.js";
import { IndividualReporteProductoProcesoDataTable } from "./elements/individual_reporte_datatable/IndividualReporteProductoProcesoDataTable.js";
import { DescargarPdfReporteProductoProcesoButton } from "./elements/download_new_reporte_form/DescargarPdfReporteProductoProcesoButton.js";
import { InfoNuevoReporteProductoProcesoForm } from "./elements/download_new_reporte_form/InfoNuevoReporteProductoProcesoForm.js";

const infoNuevoReporte = new InfoNuevoReporteProductoProcesoForm();
const reportesDataTable = new ReporteProductoProcesoDataTable();
const individualReporteDataTable = new IndividualReporteProductoProcesoDataTable(
  "reporte-procesos-table",
  [],
  {}
);

$(document).on("click", ".link-borrar-reporte-pprocesos", function (e) {
  e.preventDefault();
  reportesDataTable.delete(this.id);
});
$(document).on("click", ".link-descargar-reporte-pprocesos", function (e) {
  e.preventDefault();
  reportesDataTable.download(this.id);
});
$(document).on("click", ".link-ver-reporte-pprocesos", function (e) {
  e.preventDefault();
  reportesDataTable.view(this.id, (jsonData, consecutivo, cliente, ciudad) => {
    individualReporteDataTable.fromJSON(jsonData);
    individualReporteDataTable.toDiv("reporte-procesos-table");
    infoNuevoReporte.fill(consecutivo, cliente, ciudad);
    infoNuevoReporte.disabledForm();
    individualReporteDataTable.show();
  });
});

const descargarPdfReporteButton = new DescargarPdfReporteProductoProcesoButton(
  "generar-pdf-reporte-procesos",
  (errors) => {
    $.notify(
      {
        icon: "nc-icon nc-bell-55",
        message: `Completa todos los campos`,
      },
      {
        type: "danger",
        timer: 2500,
      }
    );
  },
  () => {
    reportesDataTable.reload();
  },
  () => {
    infoNuevoReporte.clearForm();
    individualReporteDataTable.hide();
  }
);

const generarReporteButton = new GenerateReporteProductoProcesoButton(
  "new-reporte-procesos-button",
  (dataTable) => {
    individualReporteDataTable.setData(dataTable);
    infoNuevoReporte.activeForm();
    individualReporteDataTable.show();

    descargarPdfReporteButton.setData({
      pdfdata: individualReporteDataTable.toJSON(),
    });
  },
  (errors) => {
    $.notify(
      {
        icon: "nc-icon nc-bell-55",
        message: `Completa todos los campos`,
      },
      {
        type: "danger",
        timer: 2500,
      }
    );
  }
);
$("#select-producto-reporte").on("change", function () {
  generarReporteButton.setData(this.value, generarReporteButton.cantidad);
  descargarPdfReporteButton.setData({ productoId: this.value });
});

$("#input-cantidad-producto-reporte").on("input", function () {
  generarReporteButton.setData(generarReporteButton.productoId, this.value);
  descargarPdfReporteButton.setData({ cantidad: this.value });
});

$("#input-consecutivo-reporte").on("input", function () {
  descargarPdfReporteButton.setData({ consecutivo: this.value });
});

$("#input-cliente-reporte").on("input", function () {
  descargarPdfReporteButton.setData({ cliente: this.value });
});

$("#input-ciudad-reporte").on("input", function () {
  descargarPdfReporteButton.setData({ ciudad: this.value });
});

$("#close-button").on("click", () => {
  individualReporteDataTable.hide();
});

GetAllProductos((productos) => {
  fillSelect(
    "select-producto-reporte",
    productos.map((producto) => {
      return {
        value: producto.id,
        description: producto.name,
      };
    }),
    "Selecione un producto"
  );
});

activeReportesItemsSidebar();
function activeReportesItemsSidebar() {
  $("#sidebar-reportes-item").addClass("active");
  $("#sidebar-parametrizar-item").removeClass("active");
  $("#sidebar-analisis-item").removeClass("active");
  $("#sidebar-costear-item").removeClass("active");
}
