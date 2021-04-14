import { SubidaExcel } from "./SubidaExcel.js";
import { BajadaExcel } from "./BajadaExcel.js";

let materialsJSON;

loadProductsInMaterials();
// cargado de productos de base de datos
function loadProductsInMaterials() {
  loadingSpinner();
  $.get("api/get_products.php?materials", (data, status, xhr) => {
    productsJSON = data;
    completeSpinner();
  });
}

/* Productos */
$("#fileProducts").change(function () {
  $("#spinnerAjax").removeClass("fade");
  const subidaExcelProductos = new SubidaExcel(this, "Productos", [
    "Referencia",
    "Producto",
  ]);
  subidaExcelProductos.onloadReader(() => {
    subidaExcelProductos.verifySheetName(() => {
      uploadProducts(subidaExcelProductos);
      clearFiles();
    });
  });
  $("#spinnerAjax").addClass("fade");
});

$("#fileProductsMaterials").change(function () {
  const subidaExcelProductosMateriales = new SubidaExcel(
    this,
    "Configuracion productos",
    ["Referencia", "Producto", "Material", "Cantidad"]
  );
  subidaExcelProductosMateriales.onloadReader(() => {
    subidaExcelProductosMateriales.verifySheetName(() => {
      uploadProductsMaterials(subidaExcelProductosMateriales);
    });
  });
});

function loadedFileProductsMaterials(reader, inputFileProducts) {
  $("#spinnerAjax").removeClass("fade");
  // parseo de informacion de excel
  let data = new Uint8Array(reader.result);
  let workbook = XLSX.read(data, { type: "array" });

  // cargado de datos en JSON
  let rawMaterials = XLSX.utils.sheet_to_json(workbook.Sheets["Materia Prima"]);
  rawMaterials = cleanExcelCells(rawMaterials);
  let errosRawMaterials = verifyErrorsRawMaterials(
    rawMaterials /* , products */
  );

  // validacion de los productos
  if (workbook.Sheets["Materia Prima"] != undefined) {
    if (errosRawMaterials.length == 0) {
      $.confirm({
        title: "Tezlik",
        type: "green",
        content:
          "Los datos han sido procesados y estan listo para ser cargados",
        buttons: {
          Cargar: function () {
            uploadProductsMaterials(/* products,  */ rawMaterials);
            clearFiles();
          },
          Cancelar: function () {
            $.alert("Cancelado");
            clearFiles();
          },
        },
      });
    } else {
      $.dialog({
        title: "Alerta",
        type: "red",
        icon: "fas fa-warning",
        content:
          "Este Archivo no cumple los formatos indicados <br>" +
          bugsToString(errorsProducts) +
          bugsToString(errosRawMaterials),
      });
      clearFiles();
    }
  } else {
    $.dialog({
      type: "red",
      icon: "fas fa-warning",
      content:
        "Este Archivo no cumple los formatos indicados <br>" +
        "No se encontró la hoja 'Materia Prima' en el archivo Excel",
    });
    clearFiles();
  }
  $("#spinnerAjax").addClass("fade");
}

function verifyErrorsRawMaterials(jsonObj, jsonProductObj) {
  let errors = [];
  for (let index = 0; index < jsonObj.length; index++) {
    let rawMaterial = jsonObj[index];
    if (rawMaterial.Referencia != undefined) {
      if (
        productsJSON.filter(
          (product) => product.ref == rawMaterial.Referencia
        )[0] == undefined &&
        jsonProductObj.filter(
          (product) => product.Referencia == rawMaterial.Referencia
        )[0] == undefined
      ) {
        errors.push({
          type: "Este Producto no existe",
          row: rawMaterial.__rowNum__ + 1,
        });
      }
    } else {
      errors.push({
        type: "La referencia del Producto no puede estar vacia",
        row: rawMaterial.__rowNum__ + 1,
      });
    }
    if (rawMaterial.Material != undefined) {
      if (
        materialsJSON.filter(
          (material) =>
            material.description.trim() ==
            rawMaterial.Material.toString().trim()
        )[0] == undefined
      ) {
        errors.push({
          type: "El material no existe",
          row: rawMaterial.__rowNum__ + 1,
        });
      }
    } else {
      errors.push({
        type: "El material no puede estar vacio",
        row: rawMaterial.__rowNum__ + 1,
      });
    }
    if (rawMaterial.Cantidad == undefined) {
      errors.push({
        type: "La cantidad no puede estar vacia",
        row: rawMaterial.__rowNum__ + 1,
      });
    } else if (isNaN(parseFloat(rawMaterial.Cantidad))) {
      errors.push({
        type: "La cantidad debe ser un valor numérico",
        row: rawMaterial.__rowNum__ + 1,
      });
    }
  }
  return errors;
}

function uploadProducts(subidaExcel) {
  const products = subidaExcel.array;
  $.post(
    "../products/api/upload_products.php",
    {
      products: JSON.stringify(products),
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
          subidaExcel.errorsCount,
          "producto",
          "productos"
        );
        $tableProductos.api().ajax.reload();
      }
    }
  ).always((xhr) => {
    if (xhr.status == 403) {
      $.notify(
        {
          icon: "nc-icon nc-bell-55",
          message:
            "No puede crear más productos <br> Se ha alcanzado el limite de productos licenciados, por favor, contacte a Teenus S.A.S",
        },
        {
          type: "danger",
          timer: 8000,
        }
      );
    }
  });

  completeSpinner();
}

function uploadProductsMaterials(rawMaterials) {
  loadingSpinner();
  $.post(
    "api/upload_raw_materials.php",
    {
      rawMaterials: JSON.stringify(rawMaterials),
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
                message: `Algo ha salido mal con la materia prima ${rawMaterials[index].Material} en el producto ${rawMaterials[index].Producto}`,
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
              countSuccess > 1 ? "materias primas" : "materia prima"
            }`,
          },
          {
            type: "success",
            timer: 8000,
          }
        );
        completeSpinner();
        loadProductsInProcess();
        loadProductsInMaterials();
        loadProductsGG();
        loadProductsPP();
        loadProductsInXLSX();
        /* }
    }) */
      }
    }
  ).always((xhr) => {
    if (xhr.status == 403) {
      $.notify(
        {
          icon: "nc-icon nc-bell-55",
          message:
            "No puede crear más productos <br> Se ha alcanzado el limite de productos licenciados, por favor, contacte a Teenus S.A.S",
        },
        {
          type: "danger",
          timer: 8000,
        }
      );
    }
  });

  completeSpinner();
}

/**
 * Genera un archivo excel con todos los datos de productos
 */

$("#download-products").click(function () {
  generateFileProducts();
});

function generateFileProducts() {
  loadingSpinner();
  $.get("api/get_products.php?materials", (data, status, xhr) => {
    productsJSON = data;

    // creacion del libro de excel
    var wb = XLSX.utils.book_new();
    // configuración de del libro
    wb.Props = {
      Title: "Productos de Cotizador",
      Subject: "Tezlik",
      Author: "Tezlik",
      CreatedDate: new Date(),
    };
    // agregado de los nombres de las hojas del libro
    wb.SheetNames.push("Productos");
    //wb.SheetNames.push('Materia Prima')
    // creacion de variables para cargar la información de los productos
    let ws_data = [];
    //let ws_data_2 = []
    // cargado de de productos con referencias
    productsJSON.forEach((product) => {
      let productRaw = {
        Referencia: product.ref,
        Producto: product.name,
        Rentabilidad: product.rentabilidad,
      };
      ws_data.push(productRaw);
      // recorrido para agregar todos los materiales de los productos
      /* product.materials.forEach((rawMaterial) => {
        ws_data_2.push({
          Referencia: product.ref,
          Producto: product.name,
          Material: rawMaterial.material.description,
          Cantidad: rawMaterial.quantity
        })
      }) */
    });
    if (ws_data.length <= 0) {
      /* saveAs('/formatos/formato-productos.xlsx', 'formato-productos.xlsx') */
      saveAs("/formatos/Productos.xlsx", "Productos.xlsx");
    } else {
      // parseo de objetos a las hojas de excel
      var ws = XLSX.utils.json_to_sheet(ws_data);
      //var ws_2 = XLSX.utils.json_to_sheet(ws_data_2)
      // asignacion de hojas de excel
      wb.Sheets["Productos"] = ws;
      //wb.Sheets["Materia Prima"] = ws_2;

      var wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
      var wopts = { bookType: "xlsx", bookSST: false, type: "array" };
      var wbout = XLSX.write(wb, wopts);
      saveAs(
        new Blob([wbout], { type: "application/octet-stream" }),
        "Productos.xlsx"
      );
    }
  });
  completeSpinner();
}

$("#  ").click(function (e) {
  e.preventDefault();
  generateFileProductsMaterials();
});

function generateFileProductsMaterials() {
  loadingSpinner();
  $.get("api/get_products.php?materials", (data, status, xhr) => {
    productsJSON = data;

    // creacion del libro de excel
    var wb = XLSX.utils.book_new();
    // configuración de del libro
    wb.Props = {
      Title: "Productos de Cotizador",
      Subject: "Tezlik",
      Author: "Tezlik",
      CreatedDate: new Date(),
    };
    // agregado de los nombres de las hojas del libro
    //wb.SheetNames.push('Productos')
    wb.SheetNames.push("Productos vs Materia Prima");
    // creacion de variables para cargar la información de los productos
    //let ws_data = []
    let ws_data_2 = [];
    // cargado de de productos con referencias
    productsJSON.forEach((product) => {
      /* let productRaw = {
        Referencia: product.ref,
        Producto: product.name,
        Rentabilidad: product.Rentabilidad
      } */
      //ws_data.push(productRaw)
      // recorrido para agregar todos los materiales de los productos
      product.materials.forEach((rawMaterial) => {
        ws_data_2.push({
          Referencia: product.ref,
          Producto: product.name,
          Material: rawMaterial.material.description,
          Cantidad: rawMaterial.quantity,
        });
      });
    });
    if (ws_data_2.length <= 0) {
      saveAs("/formatos/formato-productos.xlsx", "formato-productos.xlsx");
    } else {
      // parseo de objetos a las hojas de excel
      //var ws = XLSX.utils.json_to_sheet(ws_data)
      var ws_2 = XLSX.utils.json_to_sheet(ws_data_2);
      // asignacion de hojas de excel
      //wb.Sheets["Productos"] = ws;
      wb.Sheets["Materia Prima"] = ws_2;

      var wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
      var wopts = { bookType: "xlsx", bookSST: false, type: "array" };
      var wbout = XLSX.write(wb, wopts);
      saveAs(
        new Blob([wbout], { type: "application/octet-stream" }),
        "Productos.xlsx"
      );
    }
  });
  completeSpinner();
}

function clearFiles() {
  $("#fileProducts").val("");
  $("#fileProducts").siblings("label").text("Seleccionar Archivo");
  $("#fileProductsMaterials").val("");
  $("#fileProductsMaterials").siblings("label").text("Seleccionar Archivo");
}
