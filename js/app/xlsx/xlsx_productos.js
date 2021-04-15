import { SubidaExcel } from "./SubidaExcel.js";
import { ImportacionXLSX } from "./ImportacionXLSX.js";

const exportImportProduct = new ImportacionXLSX(
  "api/get_products.php?materials",
  "/formatos/Productos.xlsx",
  "Productos",
  "Productos",
  {
    Referencia: "ref",
    Producto: "name",
    Rentabilidad: "rentabilidad",
  },
  $("#fileProducts"),
  () => {}
);

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
  const subidaExcelProductos = exportImportProduct.subidaExcel;
  subidaExcelProductos.inputFile = this;
  $("#spinnerAjax").removeClass("fade");
  subidaExcelProductos.onloadReader(() => {
    subidaExcelProductos.verifySheetName(() => {
      uploadProducts(subidaExcelProductos);
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
        subidaExcel.resumenSubida(
          createdCount,
          updatedCount,
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

$("#download-products").click(function () {
  exportImportProduct.bajadaExcel.download();
});

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
