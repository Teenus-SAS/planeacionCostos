import { GetAllProductos } from "../Productos/application/get_all_productos/GetAllProductos.js";
import { ReporteProductoProcesoDataTable } from "./elements/reportes_datatable/ReporteProductoProcesoDataTable.js";
import { GenerateReporteProductoProcesoButton } from "./elements/generate_new_reporte_form/GenerateReporteProductoProcesoButton.js";
import { DescargarPdfReporteProductoProcesoButton } from "./elements/download_new_reporte_form/DescargarPdfReporteProductoProcesoButton.js";
import { InfoNuevoReporteProductoProcesoForm } from "./elements/download_new_reporte_form/InfoNuevoReporteProductoProcesoForm.js";
import { GenerateNewReporteForm } from "./elements/generate_new_reporte_form/GenerateNewReporteForm.js";
import { CosteosIndividualReporteProductoProcesoDataTable } from "./elements/individual_reporte/costeos_individual_reporte_datatable/CosteosIndividualReporteProductoProcesoDataTable.js";
import { IndividualReporteProductoProcesoDataTable } from "./elements/individual_reporte/individual_reporte_datatable/IndividualReporteProductoProcesoDataTable.js";
import { MateriasIndividualReporteProductoProcesoDataTable } from "./elements/individual_reporte/materias_individual_reporte_datatable/MateriasIndividualReporteProductoProcesoDataTable.js";
import { ServiciosExternosIndividualReporteProductoProcesoDataTable } from "./elements/individual_reporte/serviciosexternos_individual_reporte_datatable/ServiciosExternosIndividualReporteProductoProcesoDataTable.js";
import { MateriasIndividualReporteData } from "./elements/individual_reporte/materias_individual_reporte_datatable/data/MateriasIndividualReporteData.js";

import { fillSelect } from "../utils/fillSelect.js";
import { ProductosSelectedReporteDataTable } from "./elements/productos_selected_datatable/ProductosSelectedReporteDataTable.js";
import { GetProductoById } from "../Productos/application/get_producto_by_id/GetProductoById.js";
import { Notifications } from "../Shared/infrastructure/Notifications.js";
import { Loader } from "../Shared/infrastructure/Loader.js";

window.html2canvas = html2canvas;

const generateNuevoReporteForm = new GenerateNewReporteForm();
const infoNuevoReporteForm = new InfoNuevoReporteProductoProcesoForm();

const productosSelectedDataTable = new ProductosSelectedReporteDataTable();

$(document).on(
  "click",
  ".link-borrar-producto-reporte-pprocesos",
  async function (e) {
    e.preventDefault();
    const product = await productosSelectedDataTable.delete(this.id);

    if (product) {
      removeProductFromTables(product);
    }
  }
);

const reportesDataTable = new ReporteProductoProcesoDataTable();
$(document).on("click", ".link-borrar-reporte-pprocesos", async function (e) {
  e.preventDefault();
  await reportesDataTable.delete(this.id);
});

$(document).on(
  "click",
  ".link-descargar-reporte-pprocesos",
  async function (e) {
    e.preventDefault();
    Loader.show();
    await reportesDataTable.download(this.id);
  }
);
$(document).on("click", ".link-ver-reporte-pprocesos", async function (e) {
  e.preventDefault();
  Loader.show();
  const {
    pdfData: jsonData,
    consecutivo,
    cliente,
    ciudad,
    productos,
  } = await reportesDataTable.view(this.id);

  infoNuevoReporteForm.fill(consecutivo, cliente, ciudad);
  infoNuevoReporteForm.disabledForm();

  await productosSelectedDataTable.clear();
  for (const productoId in productos) {
    await productosSelectedDataTable.addProduct(
      productoId,
      productos[productoId].cantidad,
      (
        await GetProductoById(productoId)
      ).rentabilidad,
      productos[productoId].recuperacion
    );
  }
  productosSelectedDataTable.disabledDeleteOption();

  individualReporteDataTable.fromJSON(JSON.stringify(jsonData.main));
  materiasIndividualReporteDataTable.fromJSON(
    JSON.stringify(jsonData.materias)
  );
  serviciosExternosIndividualReporteDataTable.fromJSON(
    JSON.stringify(jsonData.servicios)
  );
  costeosIndividualReporteDataTable.fromJSON(JSON.stringify(jsonData.costeos));

  individualReporteDataTable.show();
  Loader.hide();
});

const individualReporteDataTable =
  new IndividualReporteProductoProcesoDataTable(
    "reporte-procesos-table",
    [],
    {}
  );
const materiasIndividualReporteDataTable =
  new MateriasIndividualReporteProductoProcesoDataTable(
    "materias-reporte-procesos-table",
    [],
    {}
  );
const serviciosExternosIndividualReporteDataTable =
  new ServiciosExternosIndividualReporteProductoProcesoDataTable(
    "servicios-externos-reporte-procesos-table",
    [],
    {}
  );
const costeosIndividualReporteDataTable =
  new CosteosIndividualReporteProductoProcesoDataTable(
    "costeo-reporte-procesos-table",
    [],
    {}
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
    infoNuevoReporteForm.clearForm();
    individualReporteDataTable.hide();
    removeAllProductsFromTables();
    $("#form-datos-reporte-procesos").modal("hide");
  }
);

$("#crear-pdf-reporte-procesos").on("click", (e) => {
  e.preventDefault();
  if (productosSelectedDataTable.data.length) {
    $("#form-datos-reporte-procesos").modal();
  } else {
    Notifications.error(
      "El reporte debe tener mínimo un producto para generar el PDF."
    );
  }
});

const generarReporteButton = new GenerateReporteProductoProcesoButton(
  "new-reporte-procesos-button",
  (
    dataTable,
    dataTableDetalle,
    totalMaterias,
    costeoData,
    productoSelected
  ) => {
    const materiasPrimasDataTable = [
      new MateriasIndividualReporteData(
        "Costos de materia prima requerida",
        totalMaterias
      ),
    ];

    productoSelected.setPdfData({
      main: dataTable,
      materias: materiasPrimasDataTable,
      servicios: dataTableDetalle,
      costeos: costeoData,
    });

    generateNuevoReporteForm.clearForm();
    generarReporteButton.setData("", "", "");

    individualReporteDataTable.show();
    individualReporteDataTable.adicionarFromData(dataTable);
    materiasIndividualReporteDataTable.adicionarFromData(
      materiasPrimasDataTable
    );
    serviciosExternosIndividualReporteDataTable.adicionarFromData(
      dataTableDetalle
    );
    costeosIndividualReporteDataTable.adicionarFromData(costeoData);

    infoNuevoReporteForm.activeForm();

    descargarPdfReporteButton.setData({
      pdfdata: {
        main: individualReporteDataTable._data,
        materias: materiasIndividualReporteDataTable._data,
        servicios: serviciosExternosIndividualReporteDataTable._data,
        costeos: costeosIndividualReporteDataTable._data,
      },
    });

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
    Loader.hide();
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
  },
  async (data) => {
    const productoAdded = await productosSelectedDataTable.addProduct(
      generarReporteButton.data.productoId,
      generarReporteButton.data.cantidad,
      (
        await GetProductoById(generarReporteButton.data.productoId)
      ).rentabilidad,
      generarReporteButton.data.recuperacion,
      {}
    );

    if (!productoAdded) {
      Notifications.error(
        "El producto ya se encuentra en el reporte.\nDebes eliminarlo primero si quieres modificar sus valores."
      );
    } else {
      descargarPdfReporteButton.setData({
        productos: {
          ...descargarPdfReporteButton.productos,
          [generarReporteButton.productoId]: {
            cantidad: generarReporteButton.cantidad,
            recuperacion: generarReporteButton.recuperacion,
          },
        },
      });
    }

    return productoAdded;
  }
);

$("#select-producto-reporte").on("change", function () {
  generarReporteButton.setData(
    this.value,
    generarReporteButton.cantidad,
    generarReporteButton.recuperacion
  );
  $("#input-cantidad-producto-reporte").val(1);
  generarReporteButton.setData(
    generarReporteButton.productoId,
    1,
    generarReporteButton.recuperacion
  );
  descargarPdfReporteButton.setData({ cantidad: 1 });
});

$("#input-cantidad-producto-reporte").on("input", function () {
  generarReporteButton.setData(
    generarReporteButton.productoId,
    this.value,
    generarReporteButton.recuperacion
  );
  descargarPdfReporteButton.setData({ cantidad: this.value });
});

$("#input-recuperacion-gastos-reporte").on("input", function () {
  generarReporteButton.setData(
    generarReporteButton.productoId,
    generarReporteButton.cantidad,
    this.value
  );
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

$("#close-button").on("click", async () => {
  individualReporteDataTable.hide();
  productosSelectedDataTable.disabledDeleteOption(false);

  generarReporteButton.setData("", "", "");
  generateNuevoReporteForm.clearForm();

  productosSelectedDataTable.clear();
  removeAllProductsFromTables();
});

const removeAllProductsFromTables = () => {
  individualReporteDataTable.setData([]);
  materiasIndividualReporteDataTable.setData([]);
  serviciosExternosIndividualReporteDataTable.setData([]);
  costeosIndividualReporteDataTable.setData([]);
};

const removeProductFromTables = (product) => {
  if (product.pdfData) {
    const pdfData = product.getPdfData();
    individualReporteDataTable.removerFromData(pdfData.main);
    materiasIndividualReporteDataTable.removerFromData(pdfData.materias);
    serviciosExternosIndividualReporteDataTable.removerFromData(
      pdfData.servicios
    );
    costeosIndividualReporteDataTable.removerFromData(pdfData.costeos);
  }
};

const productos = await GetAllProductos();
fillSelect(
  "select-producto-reporte",
  productos.map((producto) => {
    return {
      value: producto.id,
      description: producto.name,
    };
  }),
  true,
  "Selecione un producto"
);

activeReportesItemsSidebar();
function activeReportesItemsSidebar() {
  $("#sidebar-reportes-item").addClass("active");
  $("#sidebar-parametrizar-item").removeClass("active");
  $("#sidebar-analisis-item").removeClass("active");
  $("#sidebar-costear-item").removeClass("active");
}
