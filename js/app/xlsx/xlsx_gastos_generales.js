import { SubidaExcel } from "./SubidaExcel.js";

let productsJSONInExpenses;
let processesArray;
let distribucionesArray;

loadProductsInXLSX();
loadProcesses();
loadDistribuciones();
// cargado de productos de base de datos
function loadProductsInXLSX() {
  $.get("api/get_products.php?expenses&xlsx", (data, status, xhr) => {
    productsJSONInExpenses = data;
  });
}
// cargado de procesos de base de datos
function loadProcesses() {
  $.get("/app/config-general/api/get_processes.php", (data, status, xhr) => {
    processesArray = data;
  });
}
// cargado de distribuiones de base de datos
function loadDistribuciones() {
  $.get(
    "/app/products/api/get_distribuciones_directas.php",
    (data, status, xhr) => {
      distribucionesArray = data;
    }
  );
}

// Bajada

function generateFileProductExpenses() {
  loadingSpinner();
  var url = "/formatos/formato-gastos-generales.xlsx";
  /* set up async GET request */
  var req = new XMLHttpRequest();
  req.open("GET", url, true);
  req.responseType = "arraybuffer";
  req.onload = function (e) {
    loadedFileGastosGenerales(req);
  };
  req.send();
}

function generateFileDistribucionDirecta() {
  loadingSpinner();
  var url = "/formatos/formato-distribucion-directa.xlsx";
  var req = new XMLHttpRequest();
  req.open("GET", url, true);
  req.responseType = "arraybuffer";
  req.onload = function (e) {
    loadedFileDistribucionDirecta(req);
  };
  req.send();
}

function loadedFileGastosGenerales(req) {
  if (productsJSONInExpenses != undefined) {
    var data = new Uint8Array(req.response);
    var wb = XLSX.read(data, { type: "array" });

    wb.Props = {
      Title: "Gastos Generales de Cotizador",
      Subject: "Tezlik",
      Author: "Tezlik",
      CreatedDate: new Date(),
    };
    var ws_data = [];
    // cargado de de productos con referencias
    productsJSONInExpenses.forEach((product) => {
      if (product.expenses != undefined) {
        ws_data.push({
          Referencia: product.ref,
          Producto: product.name,
          "Unidades Vendidas": product.expenses.soldUnits,
          "Volumen de Ventas": product.expenses.turnOver,
        });
      }
    });
    if (ws_data.length <= 0) {
      saveAs(
        "/formatos/formato-gastos-generales.xlsx",
        "formato Gastos Generales.xlsx"
      );
    } else {
      // parseo de objetos a las hojas de excel
      var ws = XLSX.utils.json_to_sheet(ws_data);
      // asignacion de hojas de excel
      wb.Sheets["Gastos Generales"] = ws;

      var wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

      var wopts = { bookType: "xlsx", bookSST: false, type: "array" };

      var wbout = XLSX.write(wb, wopts);
      saveAs(
        new Blob([wbout], { type: "application/octet-stream" }),
        "Gastos Generales.xlsx"
      );
    }
  }
  completeSpinner();
}

function loadedFileDistribucionDirecta(req) {
  if (distribucionesArray != undefined) {
    let wb = XLSX.utils.book_new();
    wb.SheetNames.push("Distribucion");
    wb.Props = {
      Title: "Distribución Directa",
      Subject: "Tezlik",
      Author: "Tezlik",
      CreatedDate: new Date(),
    };
    let ws_data = [];
    distribucionesArray.forEach((distribucion) => {
      ws_data.push({
        Proceso: distribucion.nombreProceso,
        Porcentaje: parseFloat(distribucion.porcentaje) * 100,
      });
    });
    if (ws_data.length <= 0) {
      saveAs(
        "/formatos/formato-distribucion-directa.xlsx",
        "Formato Distribucion Directa.xlsx"
      );
    } else {
      var ws = XLSX.utils.json_to_sheet(ws_data);
      wb.Sheets["Distribucion"] = ws;
      var wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
      var wopts = { bookType: "xlsx", bookSST: false, type: "array" };
      var wbout = XLSX.write(wb, wopts);
      saveAs(
        new Blob([wbout], { type: "application/octet-stream" }),
        "Distribucion Directa.xlsx"
      );
    }
  }
  completeSpinner();
}

$("#download-products-expenses").click(function () {
  generateFileProductExpenses();
});

$("#download-distribuciones-directas").click(function () {
  generateFileDistribucionDirecta();
});

// Subida

$("#fileProductsExpenses").change(function () {
  var reader = new FileReader();
  let file = this.files[0];
  let fileInput = this;
  $(this).siblings("label").text(file.name);
  reader.onloadend = function () {
    loadedFileUploadGG(reader, fileInput);
  };
  if (file) {
    reader.readAsArrayBuffer(file);
  }
});

$("#fileDistribucionesDirectas").change(function () {
  var reader = new FileReader();
  const subidaExcel = new SubidaExcel(reader, "Distribucion", [
    "Proceso",
    "Porcentaje",
  ]);
  subidaExcel.verifySheetName((result) => {
    if (result == true) {
      uploadDistribucionDirecta(subidaExcel);
    } else {
      $.notify(
        {
          icon: "nc-icon nc-bell-55",
          message: `Proceso cancelado`,
        },
        {
          type: "info",
          timer: 4000,
        }
      );
    }
  });
});

function loadedFileUploadGG(reader, fileInput) {
  if (productsJSONInExpenses != undefined) {
    loadingSpinner();
    // parseo de informacion de excel
    let data = new Uint8Array(reader.result);
    let workbook = XLSX.read(data, { type: "array" });

    // cargado de datos en JSON
    let productsExpenses = XLSX.utils.sheet_to_json(
      workbook.Sheets["Gastos Generales"]
    );
    productExpenses = cleanExcelCells(productExpenses);

    // cambio de variable Unidades Vendidas a unidades
    // cambio de variable Volumen de Ventas a volumen
    productsExpenses.forEach((productExpenses) => {
      productExpenses.unidades = productExpenses["Unidades Vendidas"];
      productExpenses.volumen = productExpenses["Volumen de Ventas"];
    });

    // cargado de errores del formato
    let errorsproductsExpenses = verifyErrorsProductsExpenses(productsExpenses);

    // validacion de la informacion
    if (errorsproductsExpenses.length == 0) {
      if (workbook.Sheets["Gastos Generales"] != undefined) {
        $.confirm({
          title: "Tezlik",
          type: "green",
          content:
            "Los datos han sido procesados y estan listo para ser cargados",
          buttons: {
            Cargar: function () {
              uploadProductsExpenses(productsExpenses);
              clearFile(fileInput);
              loadProductsGG();
            },
            Cancelar: function () {
              $.alert("Cancelado");
              clearFile(fileInput);
            },
          },
        });
      } else {
        $.dialog({
          title: "Peligro",
          type: "red",
          icon: "fas fa-warning",
          content:
            "Este Archivo no cumple los formatos indicados <br>" +
            "No se encontró la hoja 'Gastos Generales' en el archivo Excel",
        });
        clearFile(fileInput);
      }
    } else {
      $.dialog({
        title: "Peligro",
        type: "red",
        icon: "fas fa-warning",
        content:
          "Este Archivo no cumple los formatos indicados <br>" +
          bugsToString(errorsproductsExpenses),
      });
      clearFile(fileInput);
    }
  }
  completeSpinner();
}

function verifyErrorsProductsExpenses(jsonObj) {
  let errors = [];
  for (let index = 0; index < jsonObj.length; index++) {
    let productExpenses = jsonObj[index];
    if (productExpenses.Referencia != undefined) {
      if (
        productsJSONInExpenses.filter(
          (product) => product.ref == productExpenses.Referencia
        )[0] == undefined
      ) {
        errors.push({
          type: "Este Producto no existe",
          row: productExpenses.__rowNum__ + 1,
        });
      }
    } else {
      errors.push({
        type: "La referencia del Producto no puede ser vacia",
        row: productExpenses.__rowNum__ + 1,
      });
    }
    if (productExpenses.unidades == undefined) {
      errors.push({
        type: "Las Unidades Vendidas no puede ser vacio",
        row: productExpenses.__rowNum__ + 1,
      });
    } else if (isNaN(parseFloat(productExpenses.unidades))) {
      errors.push({
        type: "Las Unidades Vendidas debe ser un valor numerico",
        row: productExpenses.__rowNum__ + 1,
      });
    }
    if (productExpenses.volumen == undefined) {
      errors.push({
        type: "El Volumen de Ventas no puede ser vacio",
        row: productExpenses.__rowNum__ + 1,
      });
    } else if (productExpenses.unidades == 0 && productExpenses.volumen > 0) {
      errors.push({
        type: "Las Unidades Vendidas no puede ser 0",
        row: productExpenses.__rowNum__ + 1,
      });
    } else if (isNaN(parseFloat(productExpenses.volumen))) {
      errors.push({
        type: "El Volumen de Ventas debe ser numérico",
        row: productExpenses.__rowNum__ + 1,
      });
    }
  }
  return errors;
}

function uploadProductsExpenses(productsExpenses) {
  loadingSpinner();
  // procesado de datos cambiando a id's
  $.post(
    "api/upload_expenses.php",
    {
      productsExpenses: JSON.stringify(productsExpenses),
    },
    (data, status) => {
      if (status == "success") {
        let countSuccess = 0;
        for (let index = 0; index < data.length; index++) {
          if (data[index]) {
            countSuccess++;
          } else {
            $.notify(
              {
                icon: "nc-icon nc-bell-55",
                message: `Algo ha salido mal con el producto ${productsExpenses[index].Producto}`,
              },
              {
                type: "danger",
                timer: 8000,
              }
            );
          }
        }
        $.notify(
          {
            icon: "nc-icon nc-bell-55",
            message: `Se ${
              countSuccess > 1 ? "han" : "ha"
            } cargado ${countSuccess} ${
              countSuccess > 1 ? "Gastos Generales" : "Gasto General"
            }`,
          },
          {
            type: "success",
            timer: 8000,
          }
        );
      }
      $tableGastosMensuales.api().ajax.reload();
      loadProductsGG();
    }
  );
  completeSpinner();
}

function uploadDistribucionDirecta(subidaExcel) {
  let errorsCount = 0;
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
        SubidaExcel.resumenSubidaExcel(
          createdCount,
          updatedCount,
          errorsCount,
          "distribución",
          "distribuciones"
        );
      }
      $tableGastosMensuales.api().ajax.reload();
      loadProductsGG();
    }
  );
  completeSpinner();
}

function bugsToString(bugs) {
  let string = "";
  bugs.forEach((bug) => {
    string += `<p style="color:red">${bug.type}  <b>fila: ${bug.row}</b> </p>`;
  });
  return string;
}
