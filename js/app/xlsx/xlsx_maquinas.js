$("#fileMachines").change(function () {
  var reader = new FileReader();
  let file = this.files[0];
  let fileInput = this;
  $(this).siblings("label").text(file.name);
  reader.onloadend = function () {
    let data = new Uint8Array(reader.result);
    let workbook = XLSX.read(data, { type: "array" });
    let workSheet = workbook.Sheets["Maquinas"];
    let machines = XLSX.utils.sheet_to_json(workSheet);
    let errorsMachines = verifyErrorsMachines(machines);
    if (
      errorsMachines.length == 0 &&
      workbook.Sheets["Maquinas"] != undefined
    ) {
      if (machines.length == 0) {
        $.alert({
          title: "Tezlik",
          content: "Este Archivo Esta vacio",
        });
      } else {
        bootbox.confirm({
          title: "Importar máquinas",
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
              uploadMachines(machines);
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

        /* $.confirm({
          title: 'Tezlik',
          content: 'Los datos han sido procesados y estan listo para ser cargados',
          type: 'green',
          buttons: {
            Cargar: function () {
              uploadMachines(machines)
            },
            Cancelar: function () {
              $.alert('Cancelado');
            }
          }
        }); */
      }
      $("#form-maquinas")[0].reset();
      clearFile(fileInput);
      clearformMachines();
    } else {
      $.dialog({
        title: "Peligro",
        content:
          "Este Archivo no cumple los formatos indicados <br>" +
          bugsToString(errorsMachines),
        type: "red",
      });
      $("#form-maquinas")[0].reset();
      clearFile(fileInput);
      clearformMachines();
    }
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

function verifyErrorsMachines(jsonObj) {
  let errors = [];
  for (let index = 0; index < jsonObj.length; index++) {
    let machine = jsonObj[index];
    if (machine.Maquina == undefined) {
      errors.push({
        type: "El nombre de la máquina no puede ser vacio",
        row: machine.__rowNum__ + 1,
      });
    }
    if (machine.Precio == undefined) {
      errors.push({
        type: "El precio no puede ser vacio",
        row: machine.__rowNum__ + 1,
      });
    } else if (isNaN(parseFloat(machine.Precio))) {
      errors.push({
        type: "El precio de la máquina debe ser numérico",
        row: machine.__rowNum__ + 1,
      });
    }
    if (machine["Años"] == undefined) {
      errors.push({
        type: "Los años de depreciación no puede ser vacio",
        row: machine.__rowNum__ + 1,
      });
    } else if (machine["Años"] <= 0) {
      errors.push({
        type: "Los años de depreciación no puede ser 0",
        row: machine.__rowNum__ + 1,
      });
    } else if (isNaN(parseFloat(machine["Años"]))) {
      errors.push({
        type: "Los años de depreciación debe ser Numérico",
        row: machine.__rowNum__ + 1,
      });
    }
    if (machine["Valor Residual"] == undefined) {
      errors.push({
        type: "El Valor Residual no puede ser vacio",
        row: machine.__rowNum__ + 1,
      });
    } else if (isNaN(parseFloat(machine["Valor Residual"]))) {
      errors.push({
        type: "El valor residual debe ser Numérico",
        row: machine.__rowNum__ + 1,
      });
    }
  }
  return errors;
}

function uploadMachines(machines) {
  loadingSpinner();
  machines.forEach((machine) => {
    machine.years = machine["Años"];
    machine.residualValue = machine["Valor Residual"];
  });
  $.post(
    "api/upload_machines.php",
    { machines: JSON.stringify(machines) },
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
                message: `Algo ha salido mal con la maquina ${machines[index].Maquina}`,
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
              countSuccess > 1 ? "maquinas" : "maquina"
            }`,
          },
          {
            type: "success",
            timer: 8000,
          }
        );
        $tableMaquinas.api().ajax.reload();
        $("#form-maquinas")[0].reset();
      }
    }
  );
  completeSpinner();
}

function clearFile(input) {
  $(input).val("");
  $(input).siblings("label").text("Seleccionar Archivo");
}

function generateFileMachines() {
  loadingSpinner();
  // creacion del libro de excel
  var wb = XLSX.utils.book_new();
  // configuración de del libro
  wb.Props = {
    Title: "Maquinas",
    Subject: "Tezlik",
    Author: "Tezlik",
    CreatedDate: new Date(),
  };
  // agregado de los nombres de las hojas del libro
  wb.SheetNames.push("Maquinas");
  // creacion de variables para cargar la información de los materiales
  let ws_data = [];
  $.get("api/get_machines.php", (data, status) => {
    // cargado de de productos con referencias
    data.forEach((machine) => {
      ws_data.push({
        Maquina: machine.name,
        Precio: machine.price,
        Años: machine.yearsDepreciation,
        "Valor Residual": machine.residualValue,
      });
    });
    // se verifican que hayan datos
    if (ws_data.length <= 0) {
      saveAs("/formatos/formato-maquinas.xlsx", "formato-maquinas.xlsx");
    } else {
      // parseo de objetos a las hojas de excel
      var ws = XLSX.utils.json_to_sheet(ws_data);
      // asignacion de hojas de excel
      wb.Sheets["Maquinas"] = ws;
      var wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
      var wopts = { bookType: "xlsx", bookSST: false, type: "array" };
      var wbout = XLSX.write(wb, wopts);

      saveAs(
        new Blob([wbout], { type: "application/octet-stream" }),
        "Maquinas.xlsx"
      );
    }
  });
  completeSpinner();
}

$("#download_maquinas").click(generateFileMachines);
