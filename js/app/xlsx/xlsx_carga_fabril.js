$("#filecargaFabril").change(function () {
  var reader = new FileReader();
  let file = this.files[0];
  let fileInput = this;
  $(this).siblings("label").text(file.name);
  reader.onloadend = function () {
    let data = new Uint8Array(reader.result);
    let workbook = XLSX.read(data, { type: "array" });
    let workSheet = workbook.Sheets["Carga Fabril"];
    let cargasF = XLSX.utils.sheet_to_json(workSheet);
    cargasF = cleanExcelCells(cargasF);
    if (workbook.Sheets["Carga Fabril"] != undefined) {
      if (cargasF.length == 0) {
        $.alert({
          title: "Tezlik",
          content: "Este archivo está vacío",
        });
      } else {
        bootbox.confirm({
          title: "Importar cargas fabriles",
          message: `Los datos han sido procesados y estan listos para ser cargados`,
          buttons: {
            confirm: {
              label: '<i class="fa fa-check"></i> Continuar',
              className: "btn-success",
            },
            cancel: {
              label: '<i class="fa fa-times"></i> Cancelar',
              className: "btn-info",
            },
          },
          callback: function (result) {
            if (result == true) {
              uploadServiciosF(cargasF);
            } else {
              $.notify(
                {
                  icon: "nc-icon nc-bell-55",
                  message: `Proceso cancelado`,
                },
                {
                  type: "info",
                  timer: 8000,
                }
              );
            }
          },
        });
      }
    } else {
      $.dialog({
        title: "Peligro",
        content:
          "<b>Este Archivo no cumple los formatos indicados: </b><br>" +
          "No se encontró la hoja 'Carga Fabril' en el archivo Excel",
        type: "red",
      });
    }

    $("#form-cargafabril")[0].reset();
    clearFile(fileInput);
    clearformMachines();
  };
  if (file) {
    reader.readAsArrayBuffer(file);
  }
});

function bugsToString(bugs) {
  let string = "";
  bugs.forEach((bug) => {
    string += `<p style="color:red">${bug.type}  <b>fila: ${bug.row}</b> </p>`;
  });
  return string;
}

function verifyErrorsCargasF(jsonObj) {
  let errors = [];
  jsonObj.filter((cargaFabril, index) => {
    if (cargaFabril.Maquina == undefined) {
      errors.push({
        type: "El nombre de la máquina no puede ser vacio",
        row: index,
        cargaFabril,
      });
    }
    if (cargaFabril.Costo == undefined) {
      errors.push({
        type: "El costo no puede ser vacio",
        row: index,
        cargaFabril,
      });
    } else if (isNaN(parseFloat(cargaFabril.Costo))) {
      errors.push({
        type: "El costo de la máquina debe ser numérico",
        row: index,
        cargaFabril,
      });
    }
    if (cargaFabril.Mantenimiento == undefined) {
      errors.push({
        type: "El mantenimiento no puede ser vacio",
        row: index,
        cargaFabril,
      });
    }
  });
  for (let index = 0; index < jsonObj.length; index++) {}
  return errors;
}
var machines;
$.get(
  "/app/config-general/api/get_machines.php",
  (dataMachines, status, xhr) => {
    machines = dataMachines;
  }
);

function uploadServiciosF(cargasF) {
  loadingSpinner();
  let errorsCount = 0;
  let errorsCargasF = verifyErrorsCargasF(cargasF);
  errorsCount += Object.keys(errorsCargasF).length;
  cargasF = cargasF.filter((carga) => {
    const cargaConError = errorsCargasF.find(
      (error) => error.cargaFabril == carga
    );
    return cargaConError ? false : true;
  });
  cargasF = cargasF.filter((cargaF, index) => {
    const machine = machines.find((mach) => mach.name === cargaF.Maquina);
    if (!machine) {
      errorsCount++;
      return false;
    } else {
      cargaF.Maquina = machine.id;
      return true;
    }
  });
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
        resumenSubidaExcel(
          createdCount,
          updatedCount,
          errorsCount,
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

function clearFile(input) {
  $(input).val("");
  $(input).siblings("label").text("Seleccionar Archivo");
}

function generateFileServiciosF() {
  loadingSpinner();
  // creacion del libro de excel
  var wb = XLSX.utils.book_new();
  // configuración de del libro
  wb.Props = {
    Title: "CargasFabriles",
    Subject: "Tezlik",
    Author: "Tezlik",
    CreatedDate: new Date(),
  };
  // agregado de los nombres de las hojas del libro
  wb.SheetNames.push("Carga Fabril");
  // creacion de variables para cargar la información de los materiales
  let ws_data = [];
  $.get("api/get_carga_fabril.php", (data, status) => {
    // cargado de de productos con referencias
    data.forEach((cargaF) => {
      const maquinaName = machines.find(
        (machine) => machine.id === cargaF.idMaquina
      ).name;
      ws_data.push({
        Maquina: maquinaName,
        Mantenimiento: cargaF.mantenimiento,
        Costo: cargaF.costo,
      });
    });
    // se verifican que hayan datos
    if (ws_data.length <= 0) {
      saveAs(
        "/formatos/formato-cargas-fabriles.xlsx",
        "formato-cargas-fabriles.xlsx"
      );
    } else {
      // parseo de objetos a las hojas de excel
      var ws = XLSX.utils.json_to_sheet(ws_data);
      // asignacion de hojas de excel
      wb.Sheets["Carga Fabril"] = ws;
      var wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
      var wopts = { bookType: "xlsx", bookSST: false, type: "array" };
      var wbout = XLSX.write(wb, wopts);

      saveAs(
        new Blob([wbout], { type: "application/octet-stream" }),
        "CargasFabriles.xlsx"
      );
    }
  });
  completeSpinner();
}

$("#download_cargaFabril").click(generateFileServiciosF);
