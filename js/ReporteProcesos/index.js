import { fillSelect } from "../utils/fillSelect.js";
import { GetAllProductos } from "../Productos/application/get_all_productos/GetAllProductos.js";
import { ReporteProductoProcesoDataTable } from "./elements/reportes_datatable/ReporteProductoProcesoDataTable.js";
import { GenerateReporteProductoProcesoButton } from "./elements/ver_reporte_button/GenerateReporteProductoProcesoButton.js";
import { DescargarPdfReporteProductoProcesoButton } from "./elements/descargar_reporte_pdf_button/DescargarPdfReporteProductoProcesoButton.js";

const reportesDataTable = new ReporteProductoProcesoDataTable();
$(document).on("click", ".link-borrar-reporte-pprocesos", function (e) {
  e.preventDefault();
  reportesDataTable.delete(this.id);
});
const generarReporteButton = new GenerateReporteProductoProcesoButton(
  "new-reporte-procesos-button",
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
    clearInfoReporteForm();
    $("#reporte-procesos-content").attr("hidden", "true");
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

function clearInfoReporteForm() {
  $("#input-consecutivo-reporte").val("");
  $("#input-cliente-reporte").val("");
  $("#input-ciudad-reporte").val("");
}
