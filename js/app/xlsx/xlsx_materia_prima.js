import { SubidaExcel } from "./SubidaExcel.js";
import { BajadaExcel } from "./BajadaExcel.js";

const endpoint = "api/get_materials.php";
const formato = "/formatos/formato-materia-prima.xlsx";
const documentName = "Materia Prima";
const sheetName = "Materiales";
const columns = {
  Referencia: "referencia",
  "Materia Prima": "description",
  Unidad: "unit",
  Costo: "cost",
};
const inputFile = $("#fileRawMaterial");
const subidaExcelProductosMateriales = new SubidaExcel(
  inputFile,
  sheetName,
  columns
);

const bajadaExcel = new BajadaExcel(
  documentName,
  sheetName,
  formato,
  columns,
  endpoint
);

function uploadMaterials(subidaExcel) {
  const materials = subidaExcel.array;
  console.log(materials);
  loadingSpinner();
  materials.forEach((material) => {
    material.descripcion = material["materia prima"].trim();
  });
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
        SubidaExcel.resumenSubidaExcel(
          createdCount,
          updatedCount,
          subidaExcel.errorsCount,
          "materia prima",
          "materias primas"
        );
        $tableMateriaPrima.api().ajax.reload();
      }
    }
  );
  subidaExcel.clearFile();
  completeSpinner();
}

$("#fileRawMaterial").change(function () {
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
  loadingSpinner();
  bajadaExcel.download();
  completeSpinner();
});
