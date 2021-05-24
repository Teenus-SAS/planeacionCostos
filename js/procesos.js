import { Notifications, verifyFields } from "./utils/notifications.js";
const notifications = new Notifications();

document.querySelector('a[href$="#process"').addEventListener("click", () => {
  elById("input-proceso").value = "";
  elById("inlineRadioProc1").click();
});

function clearFormProcess() {
  if ($("#input-proceso")[0].tagName == "SELECT") {
    let $formGroupParent = $("#input-proceso").parent();
    $("#input-proceso").fadeOut();
    $("#input-name-process").parent().parent().parent().fadeOut().remove();
    $formGroupParent.append(
      `<input id="input-proceso" class="form-control" type="text" name="proceso"> `
    );
    $("#input-proceso").remove();
  }
}

// cambio entre adicionar y modificar
$("input[name=optionProceso]").change(function () {
  tableProcesos.api().search("").draw();
  if ($(this).val() == "option2") {
  } else {
    elById("btn-procesos").value = "Adicionar";
    elById("input-proceso").value = "";
    clearFormProcess();
  }
});

let tableProcesos = $("#table-procesos").dataTable({
  language: {
    url: "/vendor/dataTables/Spanish.json",
  },
  ajax: {
    url: "api/get_processes.php?dataTable=true",
    dataSrc: "data",
  },
  columnDefs: [
    {
      targets: 0,
      className: "text-left",
    },
  ],
  columns: [
    {
      data: "name",
      render: (data, type, row) => {
        return data;
      },
    },
    {
      data: null,
      render: (data) => {
        return `<a href='#'><i data-procesos-id=${data.id} data-toggle='tooltip' title="Editar" class='nc-icon nc-refresh-69 link-editar' style='color:rgb(255, 165, 0)'></i></a><a href='#' style="margin-left: 1rem;"><i data-procesos-id=${data.id} class='nc-icon nc-simple-remove link-borrar' data-toggle='tooltip' title='Eliminar' style='color:rgb(255, 0, 0)'></i></a>`;
      },
    },
  ],
  reponsive: true,
});

$("#form-procesos").submit(function (e) {
  e.preventDefault();
  const fieldsVerification = verifyFields({
    name: "Proceso",
    value: $("#input-proceso").val(),
  });

  if (fieldsVerification) {
    notifications.error(fieldsVerification.message);
    return false;
  }
  let request = $(this).serialize();

  $.post("api/add_modify_processes.php", request).always(function (xhr) {
    switch (xhr.status) {
      case 200:
        $.notify(
          {
            icon: "nc-icon nc-bell-55",
            message: "Proceso <b>Actualizado</b> Correctamente",
          },
          {
            type: "primary",
            timer: 8000,
          }
        );
        recargar_select();
        tableProcesos.api().ajax.reload();
        /*  $('#input-proceso option:selected').text($('#input-name-process').val()) */
        break;
      case 201:
        $.notify(
          {
            icon: "nc-icon nc-bell-55",
            message: "Proceso <b>Creado</b> Correctamente",
          },
          {
            type: "success",
            timer: 8000,
          }
        );
        tableProcesos.api().ajax.reload();
        recargar_select();
        /*     $('#form-procesos')[0].reset()
              $.get('api/get_processes.php', (data, status, xhr) => {
                addSelectecFormProcces(data)
              }) */
        break;
      case 400:
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
            message: "Este Proceso ya fue creado",
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
    }
    elById("inlineRadioProc1").click();
    elById("input-proceso").value = "";
  });
});

// borrado de procesos
function deleteProceso(id, proceso) {
  bootbox.confirm({
    title: "Eliminar Procesos",
    message: `¿Está seguro de eliminar el proceso <b>${proceso}</b>?.  Esta acción no se puede deshacer`,
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
        $.post("api/delete_process.php", {
          id: id,
        }).always(function (xhr) {
          if (xhr.status == 200) {
            tableProcesos.api().ajax.reload();
            $.notify(
              {
                icon: "nc-icon nc-bell-55",
                message: `Proceso <b>Eliminado<b> correctamente`,
              },
              {
                type: "info",
                timer: 8000,
              }
            );
            recargar_select();
          } else {
            $.notify(
              {
                icon: "nc-icon nc-bell-55",
                message: `El proceso <b>${proceso}</b> no se puede eliminar. Este proceso está asociado a uno o más productos, distribuciones de gastos o nóminas`,
              },
              {
                type: "danger",
                timer: 8000,
              }
            );
          }
        });
      }
    },
  });
}

elById("table-procesos").addEventListener("click", (ev) => {
  const selectedEl = ev.target;
  const proceso = selectedEl.closest("tr").cells[0].textContent;

  if (selectedEl.classList.contains("link-borrar")) {
    deleteProceso(selectedEl.dataset.procesosId, proceso);
  } else if (selectedEl.classList.contains("link-editar")) {
    const inputProceso = elById("input-proceso");
    inputProceso.value = proceso;

    elById("proceso-id").value = selectedEl.dataset.procesosId;
    elById("btn-procesos").value = "Modificar";
    elById("inlineRadioProc2").click();
  }
});

function elById(id) {
  return document.getElementById(id);
}

export { tableProcesos };
