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
    let errorsCargasF = verifyErrorsCargasF(cargasF);
    if (errorsCargasF.length == 0) {
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
      } else {
        $.dialog({
          title: "Peligro",
          content:
            "Este Archivo no cumple los formatos indicados <br>" +
            "No se encontró la hoja 'Carga Fabril' en el archivo Excel",
          type: "red",
        });
      }

      $("#form-cargafabril")[0].reset();
      clearFile(fileInput);
      clearformMachines();
    } else {
      $.dialog({
        title: "Peligro",
        content:
          "Este Archivo no cumple los formatos indicados <br>" +
          bugsToString(errorsCargasF),
        type: "red",
      });
      $("#form-cargafabril")[0].reset();
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

function verifyErrorsCargasF(jsonObj) {
  console.log(jsonObj);
  let errors = [];
  for (let index = 0; index < jsonObj.length; index++) {
    let cargaFabril = jsonObj[index];
    if (cargaFabril.Maquina == undefined) {
      errors.push({
        type: "El nombre de la máquina no puede ser vacio",
        row: cargaFabril.__rowNum__ + 1,
      });
    }
    if (cargaFabril.Costo == undefined) {
      errors.push({
        type: "El costo no puede ser vacio",
        row: cargaFabril.__rowNum__ + 1,
      });
    } else if (isNaN(parseFloat(cargaFabril.Costo))) {
      errors.push({
        type: "El costo de la máquina debe ser numérico",
        row: cargaFabril.__rowNum__ + 1,
      });
    }
    if (cargaFabril.Insumo == undefined) {
      errors.push({
        type: "El nombre del insumo no puede ser vacio",
        row: cargaFabril.__rowNum__ + 1,
      });
    }
  }
  return errors;
}
var products;
$.get(
  "/app/config-general/api/get_machines.php",
  (dataMachines, status, xhr) => {
    products = dataMachines;
  }
);

function uploadServiciosF(cargasF) {
  let criticalError = false;

  loadingSpinner();
  cargasF.forEach((cargaF) => {
    const machine = products.find((mach) => mach.name === cargaF.Maquina);
    if (!machine) {
      criticalError = true;
      $.notify(
        {
          icon: "nc-icon nc-bell-55",
          message: `No se encontró la máquina con nombre ${cargaF.Maquina}`,
        },
        {
          type: "danger",
          timer: 8000,
        }
      );
    }
    cargaF.Maquina = machine.id;
  });

  if (!criticalError) {
    $.post(
      "api/upload_cargas_fabriles.php",
      { cargasFabriles: JSON.stringify(cargasF) },
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
                  message: `Algo ha salido mal con la carga ${cargasF[index].Insumo}`,
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
                countSuccess > 1 ? "cargas" : "carga"
              }`,
            },
            {
              type: "success",
              timer: 8000,
            }
          );
          $tableCargaFabril.api().ajax.reload();
          $("#form-cargafabril")[0].reset();
        }
      }
    );
  }
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
      const maquinaName = products.find(
        (machine) => machine.id === cargaF.idMaquina
      ).name;
      ws_data.push({
        Insumo: cargaF.insumo,
        Maquina: maquinaName,
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
