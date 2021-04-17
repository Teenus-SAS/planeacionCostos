import { ImportacionXLSX } from "./ImportacionXLSX.js";
let materials = [];
let products = [];
$.get("/app/config-general/api/get_materials.php", (data, status, xhr) => {
  materials = data;
});
$.get("/app/config-general/api/get_products.php", (data, status, xhr) => {
  products = data;
});

const exportImportProdMateriaPrima = new ImportacionXLSX(
  "api/get_products.php?materials",
  "/formatos/Productos vs Materia prima.xlsx",
  "Productos vs Materia Prima",
  "Configuracion productos",
  {
    Referencia: "ref",
    Material: "material.description",
    Cantidad: "material.quantity",
  },
  $("#fileProductsMaterials"),
  (cell) => {
    const productExists = products.find((prod) => prod.ref === cell.referencia);
    const materialExists = materials.find(
      (mat) => mat.description === cell.material
    );
    if (!materialExists) {
      return {
        type: "Material no existe",
        columnName: "material",
      };
    }
    if (!productExists) {
      return {
        type: "Producto no existe",
        columnName: "referencia",
      };
    }
    cell.material = materialExists.id;
  },
  (data) => {
    const mapped = [];
    data.forEach((product) => {
      product.materials.forEach((rawMaterial) => {
        mapped.push({
          ref: product.ref,
          material: {
            description: rawMaterial.material.description,
            quantity: rawMaterial.quantity,
          },
        });
      });
    });
    return mapped;
  }
);

$("#fileProductsMaterials").change(function () {
  const subidaExcelRawMaterial = exportImportProdMateriaPrima.subidaExcel;
  subidaExcelRawMaterial.inputFile = this;
  $("#spinnerAjax").removeClass("fade");
  subidaExcelRawMaterial.onloadReader(() => {
    subidaExcelRawMaterial.verifySheetName(() => {
      uploadProductsMaterials(subidaExcelRawMaterial);
    });
  });
  $("#spinnerAjax").addClass("fade");
});

function uploadProductsMaterials(subidaExcel) {
  const rawMaterials = subidaExcel.array;
  $.post(
    "api/upload_raw_materials.php",
    {
      rawMaterials: JSON.stringify(rawMaterials),
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
          "material",
          "materiales"
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

$("#download-products-materials").click(() => {
  exportImportProdMateriaPrima.bajadaExcel.download();
});
