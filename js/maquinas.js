import { Notifications, verifyFields } from "./utils/notifications.js";
import { verifySettedConfiguration } from "./OpcionesEmpresa/application/verify_setted_configuration/verifySettedConfiguration.js";

const notifications = new Notifications();

verifySettedConfiguration("tabMaquinas");
let flag = false;

function clearformMachines() {
  $("#input-maquinas").val("");
  $("#input-price-machine").val("");
  $("#input-years-depreciation").val("");
  $("#input-depreciation-machine").val("");
  $("#input-valor-residual").val("");
}

$("input[name=optionMaquinas]").change(function () {
  $tableMaquinas.api().search("").draw();
  if ($(this).val() == "option2") {
  } else {
    clearformMachines();
    elById("maquinas-btn").value = "ADICIONAR";
    elById("maquinas-btn").textContent = "ADICIONAR";
  }
});

var $tableMaquinas = $("#table-maquinas").dataTable({
  scrollCollapse: true,
  pageLength: 5,

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

$("#form-maquinas").submit(submitMaquinasForm);

$("#input-price-machine").keyup(calulateDepreciation);
$("#input-years-depreciation").keyup(calulateDepreciation);
$("#input-years-depreciation").change(calulateDepreciation);
$("#input-valor-residual").keyup(calulateDepreciation);
elById("input-price-machine").oninput = calulateDepreciation;
elById("input-valor-residual").oninput = calulateDepreciation;

function calulateDepreciation() {
  "use strict";

  if (!$("#input-valor-residual").val()) {
    $("#input-valor-residual").val(0);
  }

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

    const idMaquina = selectedElement.dataset.maquinaId;

    const pCompra = parseFloat(
      closestTr.cells[1].textContent.trim().replace("$", "").replaceAll(",", "")
    );
    const yearsDepreciation = parseFloat(
      selectedElement.dataset.maquinaYearsDeprec
    );
    const valorResidual = parseFloat(selectedElement.dataset.maquinaResidual);
    elById("input-price-machine").value = pCompra;
    elById("input-years-depreciation").value = yearsDepreciation;
    elById("input-valor-residual").value = valorResidual;

    const depreciacion = calulateDepreciation();

    elById("input-depreciation-machine").value = depreciacion;
    elById("input-maquinas").value = maquina;
    elById("machine-id").value = idMaquina;
  }
});

function submitMaquinasForm(e, option, maquina) {
  e.preventDefault();

  let nombreMaquina = $("#input-maquinas").val();
  let precioMaquina = $("#input-price-machine").val();
  let depreciacion = $("#input-depreciation-machine").val();
  let valor_residual = $("#input-valor-residual").val();

  let total = precioMaquina * depreciacion;

  const fieldsVerification = verifyFields(
    { name: "Nombre", value: nombreMaquina },
    { name: "Precio", value: precioMaquina },
    {
      name: "Años de Depreciación",
      value: $("#input-years-depreciation").val(),
    }
  );

  if (fieldsVerification) {
    notifications.error(fieldsVerification.message);
    return false;
  }

  if (total == 0) {
    notifications.error("Debes ingresar un valor válido para la máquina");
    return false;
  }

  if (Number.isNaN(valor_residual)) {
    notifications.error(
      "Ingrese el valor residual, este valor puede ser cero (0)"
    );
    return false;
  }

  let request = $(this).serialize();
  request += `&depreciation=${$("#input-depreciation-machine").val()}`;
  const maquinaExists = checkIfMaquinaExists(
    elById("input-maquinas").value.trim()
  );

  if (elById("inlineRadio1M").checked && !maquinaExists) {
    sendDataMachine(request);
  } else if (elById("inlineRadio2M").checked) {
    sendDataMachine(request);
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
          sendDataMachine(request);
        } else {
          clearformMachines();
          return;
        }
      },
    });
  }
}

function sendDataMachine(request) {
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
        clearformMachines();
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
        clearformMachines();
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
                message: "Se ha borrado exitosamente la máquina",
              },
              {
                type: "info",
                timer: 8000,
              }
            );
            $tableMaquinas.api().ajax.reload();
            clearformMachines();
          } else {
            $.notify(
              {
                icon: "nc-icon nc-bell-55",
                message: `<b>La máquina ${maquina} no puede ser eliminada.</b> Está asociada a uno o más productos, o cargas fabriles.</br>Debes eliminar primero éstos para continuar`,
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

function elById(id) {
  return document.getElementById(id);
}
