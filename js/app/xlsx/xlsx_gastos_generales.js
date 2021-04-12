/*
 * @Author: Teenus SAS
 * @github: Teenus-SAS
 * logica para trabajar con excel
 * importacion de datos
 * exportacion de datos
 */

var productsJSONInExpenses;

loadProductsInXLSX();
// cargado de productos de base de datos
function loadProductsInXLSX() {
  $.get("api/get_products.php?expenses&xlsx", (data, status, xhr) => {
    productsJSONInExpenses = data;
  });
}

/**
 * Genera un archivo excel con todos los datos de productos
 * Con procesos Asignados y sus repectivas maquinas
 */

function generateFileProductExpenses() {
  loadingSpinner();
  var url = "/formatos/formato-gastos-generales.xlsx";
  /* set up async GET request */
  var req = new XMLHttpRequest();
  req.open("GET", url, true);
  req.responseType = "arraybuffer";
  req.onload = function (e) {
    loadedFileGG(req);
  };
  req.send();
}

function loadedFileGG(req) {
  if (productsJSONInExpenses != undefined) {
    var data = new Uint8Array(req.response);
    var wb = XLSX.read(data, { type: "array" });

    /* DO SOMETHING WITH workbook HERE */

    // configuración de del libro
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
  } else {
    loadingSpinner();
    setTimeout(loadedFileGG, 2000);
  }
  completeSpinner();
}

// evento al hacer click en el boton para descargar el archivo
$("#download-products-expenses").click(function () {
  generateFileProductExpenses();
});

/**
 * Se genera la carga de archivo excel
 * Con esto se validara la informacion
 * Si esta es valida?
 * SI: Se enviara al servidor para ser almacenada
 * NO: Generara notificaciones
 *        - El tipo de Error
 *        - Y la fila en donde ocurrio
 */

// variables para cargar los errores en el archivo excel
var errors;

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
    completeSpinner();
  } else {
    loadingSpinner();
    setTimeout(loadedFileUploadGG(reader, fileInput), 2000);
  }
}

/**
 * Validara que se cumpla el formato y dara una lista de errores en el formato
 * @param {*} jsonObj Este objeto contiene los gastos generales generados en el excel
 * @returns un arreglo de errores con tipo y fila del error
 */
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

/**
 * Suben los gastos generales de los productos
 * Traidas del archivo excel cargado
 * @param {*} productsProcess Todos los Gastos Generales que se van a subir del archivo excel
 */
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

function bugsToString(bugs) {
  let string = "";
  bugs.forEach((bug) => {
    string += `<p style="color:red">${bug.type}  <b>fila: ${bug.row}</b> </p>`;
  });
  return string;
}
