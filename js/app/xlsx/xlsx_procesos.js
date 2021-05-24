import { tableProcesos } from "../../procesos.js";
import { ImportacionXLSX } from "./ImportacionXLSX.js";

const exportImportProcesos = new ImportacionXLSX(
  "api/get_processes.php",
  "/formatos/formato-procesos.xlsx",
  "Procesos",
  "Procesos",
  { Proceso: "name" },
  $("#fileProcess"),
  () => {}
);

function uploadProcesses(subidaExcel) {
  const processes = subidaExcel.array;
  $.post(
    "api/upload_processes.php",
    { processes: JSON.stringify(processes) },
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
          "proceso",
          "procesos"
        );

        tableProcesos.api().ajax.reload();
      }
    }
  );
}

$("#fileProcess").change(function () {
  const subidaExcelProcesos = exportImportProcesos.subidaExcel;
  subidaExcelProcesos.inputFile = this;
  $("#spinnerAjax").removeClass("fade");
  subidaExcelProcesos.onloadReader(() => {
    subidaExcelProcesos.verifySheetName(() => {
      uploadProcesses(subidaExcelProcesos);
    });
  });
  $("#spinnerAjax").addClass("fade");
});

$("#btnDownloadProcesosExcel").click(() => {
  exportImportProcesos.bajadaExcel.download();
});
