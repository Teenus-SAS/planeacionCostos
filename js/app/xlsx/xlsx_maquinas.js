import { ImportacionXLSX } from "./ImportacionXLSX.js";

const exportImportMaquinas = new ImportacionXLSX(
  "api/get_machines.php",
  "/formatos/formato-maquinas.xlsx",
  "Maquinas",
  "Maquinas",
  {
    Maquina: "name",
    Precio: "price",
    "Años ": "yearsDepreciation",
    "Valor Residual": "residualValue",
  },
  $("#fileMachines"),
  () => {}
);
$("#fileMachines").change(function () {
  const subidaExcelMaquinas = exportImportMaquinas.subidaExcel;
  subidaExcelMaquinas.inputFile = this;
  $("#spinnerAjax").removeClass("fade");
  subidaExcelMaquinas.onloadReader(() => {
    subidaExcelMaquinas.verifySheetName(() => {
      uploadMachines(subidaExcelMaquinas);
    });
  });
  $("#spinnerAjax").addClass("fade");
});

function uploadMachines(subidaExcel) {
  const machines = subidaExcel.array;
  machines.forEach((machine) => {
    machine.years = machine["años"];
  });
  $.post(
    "api/upload_machines.php",
    { machines: JSON.stringify(machines) },
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
          "maquina",
          "maquinas"
        );
        $tableMaquinas.api().ajax.reload();
        $("#form-maquinas")[0].reset();
      }
    }
  );
  completeSpinner();
}

$("#download_maquinas").click(() => {
  exportImportMaquinas.bajadaExcel.download();
});
