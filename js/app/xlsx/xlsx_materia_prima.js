import { tableMateriaPrima } from "../../materia-prima.js";
import { ImportacionXLSX } from "./ImportacionXLSX.js";

const exportImportMateriaPrima = new ImportacionXLSX(
  "api/get_materials.php",
  "/formatos/formato-materia-prima.xlsx",
  "Materia Prima",
  "Materiales",
  {
    Referencia: "referencia",
    "Materia Prima": "description",
    Unidad: "unit",
    Costo: "cost",
  },
  $("#fileRawMaterial")
);

function uploadMaterials(subidaExcel) {
  const materials = subidaExcel.array;
  $.post(
    "api/upload_materials.php",
    { materials: JSON.stringify(materials) },
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
          "materia prima",
          "materias primas"
        );
        tableMateriaPrima.api().ajax.reload();
      }
    }
  );
  subidaExcel.clearFile();
}

$("#fileRawMaterial").change(function () {
  const subidaExcelProductosMateriales = exportImportMateriaPrima.subidaExcel;
  subidaExcelProductosMateriales.inputFile = this;
  $("#spinnerAjax").removeClass("fade");
  subidaExcelProductosMateriales.onloadReader(() => {
    subidaExcelProductosMateriales.verifySheetName(() => {
      uploadMaterials(subidaExcelProductosMateriales);
    });
  });
  $("#spinnerAjax").addClass("fade");
});

$("#download_materia_prima").click(() => {
  exportImportMateriaPrima.bajadaExcel.download();
});
