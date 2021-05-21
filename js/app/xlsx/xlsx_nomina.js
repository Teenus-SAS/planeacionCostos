import { ImportacionXLSX } from "./ImportacionXLSX.js";

let procesos = [];
$.get("/app/config-general/api/get_processes.php", (data, status, xhr) => {
  procesos = data;
});
const exportImportNomina = new ImportacionXLSX(
  "api/get_rosters.php",
  "/formatos/formato-nomina.xlsx",
  "Nominas",
  "Nominas",
  {
    Nombre: "position",
    Proceso: "process.name",
    Salario: "salary",
    Transporte: "transporte",
    "Horas Extras": "extraHours",
    "Otros Ingresos": "bonus",
    Dotacion: "endowment",
    Dias: "bussinesDaysMonth",
    Horas: "workHours",
    "Tipo de contrato": "contract",
    Prestaciones: "performaceFactor",
  },
  $("#fileRosters"),
  (cell) => {
    const processExists = procesos.find(
      (proc) =>
        String(proc.name).trim().toLowerCase() ===
        String(cell.proceso).trim().toLowerCase()
    );
    if (processExists) {
      cell.proceso = processExists.id;
      cell.prestaciones = parseFloat(cell.prestaciones);
      console.log(typeof cell.prestaciones);
      return false;
    } else {
      return {
        type: "Proceso no existe",
        columnName: "proceso",
      };
    }
  }
);

$("#fileRosters").change(function () {
  const subidaExcelNomina = exportImportNomina.subidaExcel;
  subidaExcelNomina.inputFile = this;
  $("#spinnerAjax").removeClass("fade");
  subidaExcelNomina.onloadReader(() => {
    subidaExcelNomina.verifySheetName(() => {
      uploadRosters(subidaExcelNomina);
    });
  });
  $("#spinnerAjax").addClass("fade");
});

function uploadRosters(subidaExcel) {
  const rosters = subidaExcel.array;
  $.post(
    "api/upload_rosters.php",
    {
      rosters: JSON.stringify(rosters),
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
          "nomina",
          "nominas"
        );
        $tableNominas.api().ajax.reload();
      }
    }
  );
}

$("#download_nomina").click(() => {
  exportImportNomina.bajadaExcel.download();
});
