import { SubidaExcel } from "./SubidaExcel.js";
import { ImportacionXLSX } from "./ImportacionXLSX.js";
import { tableProductos } from "../../productos-adicionar.js";

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
  (cell) => {
    if (!cell.rentabilidad) {
      cell.rentabilidad = "";
    }
  }
);

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
        tableProductos.api().ajax.reload();
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
}

function uploadProductsMaterials(rawMaterials) {
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
}

$("#download-products").click(function () {
  exportImportProduct.bajadaExcel.download();
});
