import { ImportacionXLSX } from "./ImportacionXLSX.js";
let machines = [];
$.get("/app/config-general/api/get_machines.php", (data, status, xhr) => {
  machines = data;
});

const exportImportCargaFabril = new ImportacionXLSX(
  "api/get_carga_fabril.php",
  "/formatos/formato-cargas-fabriles.xlsx",
  "Cargas Fabriles",
  "Carga Fabril",
  {
    Maquina: "nombreMaquina",
    Costo: "costo",
    Mantenimiento: "mantenimiento",
  },
  $("#filecargaFabril"),
  (cell) => {
    const machineExists = machines.find(
      (mach) =>
        mach.name.trim().toLowerCase() === cell.maquina.trim().toLowerCase()
    );
    if (machineExists) {
      cell.maquina = machineExists.id;
      return false;
    } else {
      return {
        type: "Máquina no existe",
        columnName: "maquina",
      };
    }
  }
);

$("#filecargaFabril").change(function () {
  const subidaExcelCargaFabril = exportImportCargaFabril.subidaExcel;
  subidaExcelCargaFabril.inputFile = this;
  $("#spinnerAjax").removeClass("fade");
  subidaExcelCargaFabril.onloadReader(() => {
    subidaExcelCargaFabril.verifySheetName(() => {
      uploadCargaFabril(subidaExcelCargaFabril);
    });
  });
  $("#spinnerAjax").addClass("fade");
});

function uploadCargaFabril(subidaExcel) {
  const cargasF = subidaExcel.array;
  $.post(
    "api/upload_cargas_fabriles.php",
    { cargasFabriles: JSON.stringify(cargasF) },
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
          "carga fabril",
          "cargas fabriles"
        );
        $tableCargaFabril.api().ajax.reload();
        $("#form-cargafabril")[0].reset();
      }
    }
  );
  completeSpinner();
}

$("#download_cargaFabril").click(() => {
  exportImportCargaFabril.bajadaExcel.download();
});
