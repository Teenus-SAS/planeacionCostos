/* 
@Author: Teenus SAS
@github: Teenus-SAS
logica de maquinas
*/

flag = false;

elById("inlineRadioNom1").click();
document.querySelector('a[href$="maquinas"]').addEventListener("click", () => {
  resetFormMaquinas();
  elById("inlineRadio1M").click();
});

function clearformMachines() {
  if ($("#input-maquinas")[0].tagName == "SELECT") {
    let $formGroupParent = $("#input-maquinas").parent();
    $("#input-maquinas").fadeOut();
    $("#input-price-machine").val("");
    $("#input-depreciation-machine").val("");
    $formGroupParent.append(
      `<input id="input-maquinas" class="form-control" type="text" name="machine"> `
    );
    $("#input-maquinas").remove();
  }
}
function clearFile(input) {
  $(input).val("");
}

$("input[name=optionMaquinas]").change(function () {
  $tableMaquinas.api().search("").draw();
  if ($(this).val() == "option2") {
    // desaparece el input
    /*  $('#input-maquinas').fadeOut() */
    // guarda el padre del input
    /*  let $formGroupParent = $('#input-maquinas').parent()
     $.get('api/get_machines.php', (data, status, xhr) => { */
    // se consulta las maquinas de esa empresa
    /*       if (status == 'success') { */
    // se agregan todas las maquinas en un input select
    /*        let string = `<select id="input-maquinas" class="form-control" name="machine">
           <option selected disabled>Seleccione una maquina</option>`
           machines = data
           data.forEach((machine) => {
             string += `<option value="${machine.id}">${machine.name}</option>`
           })
           string += '</select>'
           $formGroupParent.append(string) */
    // se quita el input de tipo de texto
    /*         $('#input-maquinas').remove()
    
            $('#input-maquinas').change(function () {
              let machineSelected = data.filter(machine => machine.id == $(this).val())[0]
              $('#input-price-machine').val(machineSelected.price)
              $('#input-depreciation-machine').val(parseFloat(machineSelected.depreciation))
              $('#input-years-depreciation').val(machineSelected.yearsDepreciation)
              $('#input-valor-residual').val(machineSelected.residualValue)
              $tableMaquinas.api().search(machineSelected.name).draw();
            })
          } else {
            location = '/login'
          } */
    /*     }) */
  } else {
    clearformMachines();
    elById("maquinas-btn").value = "ADICIONAR";
    elById("maquinas-btn").textContent = "ADICIONAR";
  }
});

// inicializacion de datatable para maquinas

// inicializacion de datatable
var $tableMaquinas = $("#table-maquinas").dataTable({
  //"scrollY": "300px",
  scrollCollapse: true,
  //"paging": false,
  pageLength: 25,

  language: {
    url: "/vendor/dataTables/Spanish.json",
  },
  ajax: {
    url: "api/get_machines.php?dataTable=true",
    dataSrc: "data",
  },
  columnDefs: [
    {
      targets: 0,
      className: "text-left",
    },
    {
      targets: 1,
      className: "text-right",
    },
    /*   {
        targets: -2,
        className: 'text-right'
      } */
  ],
  columns: [
    {
      data: "name",
      render: (data, type, row) => {
        return `<span class="name-left">${data}</span>`;
      },
    },
    {
      data: "price",
      render: function (data, type, row) {
        return `$ ${$.number(data, 0, ".", ",")}`;
      },
    },
    {
      data: "depreciation",
      render: function (data, type, row) {
        if (parseFloat(data) < 1) {
          /* return data */
          return $.number(data, 2, ".", ",");
        } else {
          return $.number(data, 2, ".", ",");
        }
      },
    },
    {
      data: null,
      render: function (data) {
        return `<a href='#'><i data-maquina-id=${data.id} data-maquina-years-deprec=${data.yearsDepreciation} data-maquina-residual=${data.residualValue} data-toggle='tooltip' title="Editar" class='nc-icon nc-refresh-69 link-editar' style='color:rgb(255, 165, 0)'></i></a><a href='#' style="margin-left: 1rem;"><i data-maquina-id=${data.id} class='nc-icon nc-simple-remove link-borrar' data-toggle='tooltip' title='Eliminar' style='color:rgb(255, 0, 0)'></i></a>`;
      },
    },
  ],
  reponsive: true,
});
$tableMaquinas.width("100%");
/* $tableMaquinas.on('click', 'tr', function () {
  $(this).toggleClass('selected');
}) */

// formulario para adicionar o modificar valores de una maquina
$("#form-maquinas").submit(submitForm);

// calcular depreciacion con el cambio de precio
$("#input-price-machine").keyup(calulateDepreciation);
$("#input-years-depreciation").keyup(calulateDepreciation);
$("#input-years-depreciation").change(calulateDepreciation);
$("#input-valor-residual").keyup(calulateDepreciation);
elById("input-price-machine").oninput = calulateDepreciation;
elById("input-valor-residual").oninput = calulateDepreciation;

function calulateDepreciation() {
  "use strict";

  let request = {
    price: $("#input-price-machine").val(),
    years: $("#input-years-depreciation").val(),
    residualValue: $("#input-valor-residual").val(),
  };
  $.get("api/get_depreciation.php", request, (data, status) => {
    if (status == "success") {
      if (parseFloat(data.depreciation) < 1) {
        let sum = 0;
        for (
          let index = 0;
          index < data.depreciation.toString().length;
          index++
        ) {
          sum += data.depreciation.toString().charAt(index) == "0" ? 1 : 0;
        }
        sum += 3;
        $("#input-depreciation-machine").val(
          Math.round10(parseFloat(data.depreciation), -sum)
        );
      } else {
        $(
          $("#input-depreciation-machine").val(
            Math.round10(parseFloat(data.depreciation), -2)
          )
        );
      }
    } else {
      location.href = "/login";
    }
  });
}
// agreado de formato al input de precio
$("#input-price-machine").number(true, 2);
$("#input-valor-residual").number(true, 2);

function loadingSpinner() {
  $("#spinnerAjax").removeClass("fade");
}

function completeSpinner() {
  $("#spinnerAjax").addClass("fade");
}

document.getElementById("table-maquinas").addEventListener("click", (ev) => {
  const selectedElement = ev.target;
  const closestTr = selectedElement.closest("tr");
  const maquina = closestTr.cells[0].textContent;

  if (selectedElement.classList.contains("link-borrar")) {
    deleteMachine(selectedElement.dataset.maquinaId, maquina);
  } else if (selectedElement.classList.contains("link-editar")) {
    elById("inlineRadio2M").click();

    elById("maquinas-btn").value = "MODIFICAR";
    elById("maquinas-btn").textContent = "MODIFICAR";
    const pCompra = closestTr.cells[1].textContent.replace("$", "").trim();
    const depreciacion = closestTr.cells[2].textContent.trim().replace(",", "");
    
    const yearsDepreciation = selectedElement.dataset.maquinaYearsDeprec;
    const valorResidual = selectedElement.dataset.maquinaResidual;
    const idMaquina = selectedElement.dataset.maquinaId;

    elById("input-price-machine").value = pCompra;
    elById("input-valor-residual").value = parseFloat(valorResidual);
    elById("input-years-depreciation").value = yearsDepreciation;
    elById("input-depreciation-machine").value = depreciacion;
    elById("input-maquinas").value = maquina;
    elById("machine-id").value = idMaquina;
  }
});

function submitForm(e, option, maquina) {
  e.preventDefault();

  let precio_maquina = $("#input-price-machine").val();
  let depreciacion = $("#input-depreciation-machine").val();
  let valor_residual = $("#input-valor-residual").val();

  let total = precio_maquina * depreciacion;

  if (total == 0) {
    $.notify(
      {
        icon: "nc-icon nc-bell-55",
        message: "Ingrese todos los <b>datos</b>",
      },
      {
        type: "primary",
        timer: 8000,
      }
    );
    return false;
  }

  if (valor_residual == 0) {
    $.notify(
      {
        icon: "nc-icon nc-bell-55",
        message: "Ingrese el valor residual, este valor puede ser cero (0)",
      },
      {
        type: "primary",
        timer: 8000,
      }
    );
    return false;
  }

  let request = $(this).serialize();
  request += `&depreciation=${$("#input-depreciation-machine").val()}`;
  const maquinaExists = checkIfMaquinaExists(
    elById("input-maquinas").value.trim()
  );
  
  if (elById("inlineRadio1M").checked && !maquinaExists) {
    sendData(request);
  } else if (elById("inlineRadio2M").checked) {
    sendData(request);
  } else if (elById("inlineRadio1M").checked && maquinaExists) {
    bootbox.confirm({
      title: "Crear Máquinas",
      message: `La Máquina <b>"${
        elById("input-maquinas").value
      }"</b> ya existe, ¿Desea actualizarla?`,
      buttons: {
        confirm: {
          label: '<i class="fa fa-check"></i> Si',
          className: "btn-danger",
        },
        cancel: {
          label: '<i class="fa fa-times"></i> No',
          className: "btn-info",
        },
      },
      callback: function (result) {
        if (result == true) {
          sendData(request);
        } else {
          resetFormMaquinas();
          return;
        }
      },
    });

    /*  $.confirm({
      title: 'Tezlik',
      content: `La Máquina ${elById('input-maquinas').value} ya existe, ¿Desea actualizarla?`,
      buttons: {
        SI: function () {
          sendData(request);
        },
        No: function () {
          resetFormMaquinas();
          return;
        }
      }
    }) */
  }
}

function sendData(request) {
  $.post("api/add_modify_machines.php", request).always(function (xhr) {
    flag = false;
    switch (xhr.status) {
      case 200:
        $.notify(
          {
            icon: "nc-icon nc-bell-55",
            message: "Maquina <b>Actualizada</b>",
          },
          {
            type: "primary",
            timer: 8000,
          }
        );
        $tableMaquinas.api().ajax.reload();
        break;
      case 201:
        $.notify(
          {
            icon: "nc-icon nc-bell-55",
            message: "Máquina <b>Creada</b> Correctamente",
          },
          {
            type: "success",
            timer: 8000,
          }
        );
        $tableMaquinas.api().ajax.reload();
        $("#form-maquinas")[0].reset();
        break;
      case 412:
        $.notify(
          {
            icon: "nc-icon nc-bell-55",
            message:
              "<b>Selecciona</b> una opción para <b>adicionar</b> o <b>modificar</b>",
          },
          {
            type: "warning",
            timer: 8000,
          }
        );
        break;
      case 400:
        flag = true;
        $.notify(
          {
            icon: "nc-icon nc-bell-55",
            message: "<b>Completa</b> Todos los campos",
          },
          {
            type: "warning",
            timer: 8000,
          }
        );
        break;
      case 500:
        $.notify(
          {
            icon: "nc-icon nc-bell-55",
            message: "Ocurrió un error mientras se creaba la máquina",
          },
          {
            type: "danger",
            timer: 8000,
          }
        );
        break;
      case 401:
        location.href = "/login";
        break;
      case 501:
        flag = true;
        $.notify(
          {
            icon: "nc-icon nc-bell-55",
            message: "El precio no puede ser 0 cero",
          },
          {
            type: "danger",
            timer: 8000,
          }
        );
        break;
    }
    if (flag == false) {
      elById("maquinas-btn").value = "ADICIONAR";
      elById("maquinas-btn").textContent = "ADICIONAR";
      elById("inlineRadio1M").click();
      resetFormMaquinas();
    }
  });
}

function deleteMachine(id, maquina) {
  bootbox.confirm({
    title: "Eliminar Máquinas",
    message: `¿Está seguro de eliminar esta máquina?.  Esta acción no se puede deshacer`,
    buttons: {
      confirm: {
        label: '<i class="fa fa-check"></i> Si',
        className: "btn-danger",
      },
      cancel: {
        label: '<i class="fa fa-times"></i> No',
        className: "btn-info",
      },
    },
    callback: function (result) {
      if (result == true) {
        $.post("api/delete_machine.php", {
          id: id,
        }).always(function (xhr) {
          if (xhr.status == 200) {
            $.notify(
              {
                icon: "nc-icon nc-bell-55",
                message: "Se ha borrado una máquina",
              },
              {
                type: "info",
                timer: 8000,
              }
            );
            $tableMaquinas.api().ajax.reload();
          } else {
            $.notify(
              {
                icon: "nc-icon nc-bell-55",
                message: `La máquina <b>${maquina}</b> esta asociada a uno o más productos`,
              },
              {
                type: "danger",
                timer: 8000,
              }
            );
          }
        });
      } else {
        resetFormMaquinas();
        return;
      }
    },
  });
}

function formatCurrency(resultadoFloat) {
  return $.number(resultadoFloat, 2, ",", ".");
}

function resetFormMaquinas() {
  elById("input-maquinas").value = "";
  elById("input-price-machine").value = "";
  elById("input-valor-residual").value = "";
  elById("input-depreciation-machine").value = "";
}

function checkIfMaquinaExists(name) {
  return Array.from(elById("table-maquinas").tBodies[0].rows).some(
    (row) => row.cells[0].textContent.trim() === name.trim()
  );
}
