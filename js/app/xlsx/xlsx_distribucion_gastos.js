import { ImportacionXLSX } from "./ImportacionXLSX.js";

let procesos = [];
const updateProcesos = () => {
  $.get("/app/config-general/api/get_processes.php", (data, status) => {
    procesos = data;
  });
};
let productos = [];
const updateProductos = () => {
  $.get("/app/config-general/api/get_products.php", (data, status) => {
    productos = data;
  });
};
const reloadTables = () => {
  const tableDistribucionDirecta = $("#tableDistribucionDirecta").dataTable();
  tableDistribucionDirecta.api().ajax.reload();
  const tableGastosGenerales = $("#tableGastosMensuales").dataTable();
  tableGastosGenerales.api().ajax.reload();
};

const exportImportDDirecta = new ImportacionXLSX(
  "/app/products/api/get_distribuciones_directas.php",
  "/formatos/formato-distribucion-directa.xlsx",
  "Distribución Directa",
  "Distribucion",
  {
    Proceso: "nombreProceso",
    Porcentaje: "porcentaje",
  },
  $("#fileProductsExpenses"),
  (cell) => {
    updateProcesos();
    const existsProcess = procesos.find(
      (proc) =>
        String(proc.name).trim().toLowerCase() ==
        String(cell.proceso).trim().toLowerCase()
    );
    if (existsProcess) {
      cell.proceso = existsProcess.id;
      return false;
    } else {
      return {
        type: "Proceso no existe",
        columnName: "proceso",
      };
    }
  }
);

const exportImportDGastos = new ImportacionXLSX(
  "api/get_products.php?expenses&xlsx",
  "/formatos/formato-gastos-generales.xlsx",
  "Gastos Generales",
  "Gastos Generales",
  {
    Referencia: "ref",
    Producto: "name",
    "Unidades Vendidas": "expenses.soldUnits",
    "Volumen de Ventas": "expenses.turnOver",
  },
  $("#fileDistribucionesDirectas"),
  (cell) => {
    updateProductos();
    const existsProduct = productos.find((prod) => prod.name == cell.producto);
    if (existsProduct) {
      cell.producto = existsProduct.id;
      return false;
    } else {
      return {
        type: "Producto no existe",
        columnName: "producto",
      };
    }
  }
);

// Bajada
$("#download-products-expenses").click(function () {
  exportImportDGastos.bajadaExcel.download();
});

$("#download-distribuciones-directas").click(function () {
  exportImportDDirecta.bajadaExcel.download();
});

// Subida
$("#fileProductsExpenses").change(function () {
  const subidaExcelDGastos = exportImportDGastos.subidaExcel;
  subidaExcelDGastos.inputFile = this;
  $("#spinnerAjax").removeClass("fade");
  subidaExcelDGastos.onloadReader(() => {
    subidaExcelDGastos.verifySheetName(() => {
      uploadProductsExpenses(subidaExcelDGastos);
    });
  });
  $("#spinnerAjax").addClass("fade");
  subidaExcelDGastos.clearFile();
});

$("#fileDistribucionesDirectas").change(function () {
  const subidaExcelDDirecta = exportImportDDirecta.subidaExcel;
  subidaExcelDDirecta.inputFile = this;
  $("#spinnerAjax").removeClass("fade");
  subidaExcelDDirecta.onloadReader(() => {
    subidaExcelDDirecta.verifySheetName(() => {
      uploadDistribucionDirecta(subidaExcelDDirecta);
    });
  });
  $("#spinnerAjax").addClass("fade");
  subidaExcelDDirecta.clearFile();
});

function uploadProductsExpenses(subidaExcel) {
  const productsExpenses = subidaExcel.array;
  $.post(
    "api/upload_expenses.php",
    {
      productsExpenses: JSON.stringify(productsExpenses),
    },
    (data, status) => {
      if (status == "success") {
        let updatedCount = 0;
        let createdCount = 0;
        for (let index = 0; index < data.length; index++) {
          if (data[index]) {
            updatedCount++;
          } else {
            createdCount++;
          }
        }
        subidaExcel.resumenSubida(
          createdCount,
          updatedCount,
          "gasto general",
          "gastos generales"
        );
      }
      reloadTables();
      loadProductsGG();
    }
  );
}

function uploadDistribucionDirecta(subidaExcel) {
  loadingSpinner();
  $.post(
    "api/upload_distribucion_directa.php",
    {
      distribuciones: JSON.stringify(subidaExcel.array),
    },
    (data, status) => {
      if (status == "success") {
        let updatedCount = 0;
        let createdCount = 0;
        for (let index = 0; index < data.length; index++) {
          if (data[index]) {
            updatedCount++;
          } else {
            createdCount++;
          }
        }
        subidaExcel.resumenSubida(
          createdCount,
          updatedCount,
          "distribución",
          "distribuciones"
        );
      }
      reloadTables();
      loadProductsGG();
    }
  );
  completeSpinner();
}
