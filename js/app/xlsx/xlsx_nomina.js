/**
 * Teenus SAS
 * @github Teenus SAS
 * logica para trabajar con excel
 * importacion de datos
 * exportacion de datos
 */

var processesInRostersJSON;

loadProcessesInRoster();
// cargado de productos de base de datos
function loadProcessesInRoster() {
  loadingSpinner();
  $.get("api/get_processes.php", (data, status, xhr) => {
    processesInRostersJSON = data;
  });
  completeSpinner();
}

/**
 * Se genera la carga de archivo excel
 * Con esto se validara la informacion
 * Si esta es valida?
 * SI: Se enviara al servidor para ser almacenada
 * NO: Generara notificaciones
 *        - El tipo de Error
 *        - Y la fila en donde ocurrio
 */

// variables para cargar los errores en el archivo excel
var errors;

$("#fileRosters").change(function () {
  var reader = new FileReader();
  let file = this.files[0];
  var inputFileProducts = this;
  $(this).siblings("label").text(file.name);
  reader.onloadend = function () {
    loadedFileRosters(reader, inputFileProducts);
  };
  if (file) {
    reader.readAsArrayBuffer(file);
  }
});

/**
 * se encarga de leer el archivo excel y decidir si
 * se sube o no
 * @param {*} reader objeto reader que parsea el archivo excel
 * @param {*} inputFileProducts el inputFile donde se subio el archivo
 */
function loadedFileRosters(reader, inputFileProducts) {
  if (processesInRostersJSON != undefined) {
    loadingSpinner();
    // parseo de informacion de excel
    let data = new Uint8Array(reader.result);
    let workbook = XLSX.read(data, { type: "array" });

    // cargado de datos en JSON
    let rosters = XLSX.utils.sheet_to_json(workbook.Sheets["Nominas"]);
    // cargado de errores del formato
    let errorsRosters = verifyErrorsRosters(rosters);

    // validacion de los productos
    if (errorsRosters.length == 0) {
      if (workbook.Sheets["Nominas"] != undefined) {
        bootbox.confirm({
          title: "Importar nómina",
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
              rosters.forEach((roster) => {
                roster.Proceso = processesInRostersJSON.filter(
                  (process) =>
                    process.name.trim().toLowerCase() ==
                    roster.Proceso.trim().toLowerCase()
                )[0].id;
              });
              uploadRosters(rosters);
              clearFile(inputFileProducts);
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
              clearFile(inputFileProducts);
            }
          },
        });
      } else {
        $.dialog({
          title: "Tezlik",
          type: "red",
          icon: "fas fa-warning",
          content:
            "Este Archivo no cumple los formatos indicados <br>" +
            "No se encontró la hoja 'Nominas' en el archivo Excel",
        });
        clearFile(inputFileProducts);
      }

      /* $.confirm({
        title: 'Tezlik',
        type: 'green',
        content: 'Los datos han sido procesados y estan listo para ser cargados',
        buttons: {
          Cargar: function () {
            rosters.forEach(roster => {
              roster.Proceso = processesInRostersJSON.filter((process) => process.name.trim().toLowerCase() == roster.Proceso.trim().toLowerCase())[0].id
            })
            uploadRosters(rosters)
            clearFile(inputFileProducts)
          },
          Cancelar: function () {
            $.alert('Cancelado');
            clearFile(inputFileProducts)
          }
        }
      }) */
    } else {
      $.dialog({
        title: "Tezlik",
        type: "red",
        icon: "fas fa-warning",
        content:
          "Este Archivo no cumple los formatos indicados <br>" +
          bugsToString(errorsRosters),
      });
      clearFile(inputFileProducts);
    }
  } else {
    loadingSpinner();
    setTimeout(loadedFileRosters(reader, inputFileProducts), 2000);
  }
  completeSpinner();
}

/**
 * Validara que se cumpla el formato y dara una lista de errores en el formato
 * @param {*} jsonObj Este objeto contiene las nominas generadas en el excel
 * @returns un arreglo de errores con tipo y fila del error
 */
function verifyErrorsRosters(jsonObj, jsonProductObj) {
  let errors = [];
  for (let index = 0; index < jsonObj.length; index++) {
    let roster = jsonObj[index];
    if (roster.Cargo == undefined) {
      errors.push({
        type: "El cargo no puede estar vacio",
        row: roster.__rowNum__ + 1,
      });
    }
    if (roster.Proceso != undefined) {
      if (
        processesInRostersJSON.filter(
          (process) =>
            process.name.trim().toLowerCase() ==
            roster.Proceso.toString().trim().toLowerCase()
        )[0] == undefined
      ) {
        errors.push({
          type: "Este proceso no existe",
          row: roster.__rowNum__ + 1,
        });
      }
    } else {
      errors.push({
        type: "El proceso no puede estar vacio",
        row: roster.__rowNum__ + 1,
      });
    }
    if (roster.Cantidad != undefined) {
      if (roster.Cantidad <= 0) {
        errors.push({
          type: "La cantidad debe ser mayor a cero",
          row: roster.__rowNum__ + 1,
        });
      }
    } else {
      errors.push({
        type: "La cantidad no puede estar vacia",
        row: roster.__rowNum__ + 1,
      });
    }
    if (roster.Salario != undefined) {
      if (isNaN(parseFloat(roster.Salario))) {
        errors.push({
          type: "El salario debe ser un valor numérico",
          row: roster.__rowNum__ + 1,
        });
      } else if (roster.Salario <= 0) {
        errors.push({
          type: "El salario debe ser mayor a cero",
          row: roster.__rowNum__ + 1,
        });
      }
    } else {
      errors.push({
        type: "El salario no puede estar vacio",
        row: roster.__rowNum__ + 1,
      });
    }
    let extrahours = roster["Horas Extras"];
    if (extrahours != undefined) {
      if (isNaN(parseFloat(extrahours))) {
        errors.push({
          type: "La horas extras debe ser un valor numérico",
          row: roster.__rowNum__ + 1,
        });
      } else if (extrahours < 0) {
        errors.push({
          type: "Las horas extras no puede ser menores a cero",
          row: roster.__rowNum__ + 1,
        });
      }
    } else {
      errors.push({
        type: "Las horas extras no puede estar vacias",
        row: roster.__rowNum__ + 1,
      });
    }
    if (roster.Bonificaciones != undefined) {
      if (isNaN(parseFloat(roster.Bonificaciones))) {
        errors.push({
          type: "Las bonificaciones debe ser un valor numérico",
          row: roster.__rowNum__ + 1,
        });
      } else if (roster.Bonificaciones < 0) {
        errors.push({
          type: "Las bonificaciones no puede ser menores a cero",
          row: roster.__rowNum__ + 1,
        });
      }
    } else {
      errors.push({
        type: "Las bonificaciones no puede estar vacias",
        row: roster.__rowNum__ + 1,
      });
    }

    if (roster.Dotacion != undefined) {
      if (isNaN(parseFloat(roster.Dotacion))) {
        errors.push({
          type: "Las dotación debe ser un valor numérico",
          row: roster.__rowNum__ + 1,
        });
      } else if (roster.Dotacion < 0) {
        errors.push({
          type: "Las dotación no puede ser menor a cero",
          row: roster.__rowNum__ + 1,
        });
      }
    } else {
      errors.push({
        type: "Las dotación no puede estar vacia",
        row: roster.__rowNum__ + 1,
      });
    }

    if (roster.Dias != undefined) {
      if (isNaN(parseFloat(roster.Dias))) {
        errors.push({
          type: "Los días debe ser un valor numérico",
          row: roster.__rowNum__ + 1,
        });
      } else if (roster.Dias <= 0) {
        errors.push({
          type: "Los días de trabajo debe ser mayor a cero",
          row: roster.__rowNum__ + 1,
        });
      } else if (roster.Dias > 31) {
        errors.push({
          type: "Los días de trabajo no puede ser mayor a 31",
          row: roster.__rowNum__ + 1,
        });
      }
    } else {
      errors.push({
        type: "Los dias de trabajo no puede estar vacia",
        row: roster.__rowNum__ + 1,
      });
    }

    if (roster.Horas != undefined) {
      if (isNaN(parseFloat(roster.Horas))) {
        errors.push({
          type: "Las horas debe ser un valor numérico",
          row: roster.__rowNum__ + 1,
        });
      } else if (roster.Horas <= 0) {
        errors.push({
          type: "Las horas de trabajo debe ser mayor a cero",
          row: roster.__rowNum__ + 1,
        });
      } else if (roster.Horas > 18) {
        errors.push({
          type: "Las horas de trabajo no puede ser mayor a 18",
          row: roster.__rowNum__ + 1,
        });
      }
    } else {
      errors.push({
        type: "Las horas de trabajo no puede estar vacia",
        row: roster.__rowNum__ + 1,
      });
    }

    let contract = roster["Tipo de contrato"];
    if (contract != undefined) {
      if (contract != "nomina" && contract != "servicios") {
        errors.push({
          type: "El tipo de contrato no existe",
          row: roster.__rowNum__ + 1,
        });
      }
    } else {
      errors.push({
        type: "El tipo de contrato no puede estar vacia",
        row: roster.__rowNum__ + 1,
      });
    }
    if (roster.Prestaciones == undefined) {
      errors.push({
        type: "Las prestaciones no puede estar vacia",
        row: roster.__rowNum__ + 1,
      });
    } else if (isNaN(parseFloat(roster.Prestaciones))) {
      errors.push({
        type: "Las prestaciones debe ser numéricas",
        row: roster.__rowNum__ + 1,
      });
    }
  }
  return errors;
}

/**
 * Suben las nominas
 * Traidas del archivo excel cargado
 * @param {*} products Todos las nominas que se van a subir del archivo excel
 */
function uploadRosters(rosters) {
  loadingSpinner();
  $.post(
    "api/upload_rosters.php",
    {
      rosters: JSON.stringify(rosters),
    },
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
                message: `Algo ha salido mal con el producto ${rosters[index].Cargo}`,
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
              countSuccess > 1 ? "nominas" : "nomina"
            }`,
          },
          {
            type: "success",
            timer: 8000,
          }
        );
        $tableNominas.api().ajax.reload();
      }
    }
  );
  completeSpinner();
}

/**
 * Pasa a un formato html los errores encontrados
 * en le archivo excel
 * @param {*} bugs Arreglo de errores encontrados
 */
function bugsToString(bugs) {
  let string = "";
  bugs.forEach((bug) => {
    string += `<p style="color:red">${bug.type}  <b>fila: ${bug.row}</b> </p>`;
  });
  return string;
}

/**
 * Genera un archivo excel con todos los datos de productos
 */
function generateFileRosters() {
  loadingSpinner();
  $.get("api/get_rosters.php", (data, status) => {
    // creacion del libro de excel
    var wb = XLSX.utils.book_new();
    // configuración de del libro
    wb.Props = {
      Title: "Productos de Cotizador",
      Subject: "Tezlik",
      Author: "Tezlik",
      CreatedDate: new Date(),
    };
    // agregado de los nombres de las hojas del libro
    wb.SheetNames.push("Nominas");
    let ws_data = [];
    data.forEach((roster) => {
      ws_data.push({
        Cargo: roster.position,
        Proceso: roster.process.name,
        Cantidad: roster.numberEmployees,
        Salario: roster.salary,
        "Horas Extras": roster.extraHours,
        Bonificaciones: roster.bonus,
        Dotacion: roster.endowment,
        Dias: roster.bussinesDaysMonth,
        Horas: roster.workHours,
        "Tipo de contrato": roster.contract,
        Prestaciones: roster.performaceFactor / 100,
      });
    });
    if (ws_data.length <= 0) {
      saveAs("/formatos/formato-nomina.xlsx", "formato nomina.xlsx");
    } else {
      // parseo de objetos a las hojas de excel
      var ws = XLSX.utils.json_to_sheet(ws_data);
      // asignacion de hojas de excel
      wb.Sheets["Nominas"] = ws;
      // ultima fila de k
      let endRow = ws["!ref"].substring(3, ws["!ref"].length);
      // rango a recorrer en el formato
      let range = XLSX.utils.decode_range(`K2:${endRow}`);

      for (let index = range.s.r; index <= range.e.r; index++) {
        var cell_address = { c: range.s.c, r: index };
        var cell_ref = XLSX.utils.encode_cell(cell_address);

        ws[cell_ref].z = "0%";
      }

      var wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

      var wopts = { bookType: "xlsx", bookSST: false, type: "array" };

      var wbout = XLSX.write(wb, wopts);
      saveAs(
        new Blob([wbout], { type: "application/octet-stream" }),
        "Nominas.xlsx"
      );
    }
  });
  completeSpinner();
}

/**
 * Limpia un los archivos subidos en un input file
 * @param {*} input El inputFile que se desea limpiar
 */
function clearFile(input) {
  $(input).val("");
  $(input).siblings("label").text("Seleccionar Archivo");
}
// evento para descargar el archvio excel
$("#download_nomina").click(generateFileRosters);
