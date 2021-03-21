/* 
@Author: Teenus SAS
@github: Teenus-SAS
logica de carga fabril
*/

/* Cambiar puntero */
$(".link-borrar").css("cursor", "pointer");

// cargar select maquinas
$(document).ready(function () {
  $.get(
    "/app/config-general/api/get_machines.php",
    (_machines, status, xhr) => {
      $("#cfmaquinas").append(
        `<option selected disabled>Selecciona un máquina</option>`
      );
      machinesJSON = _machines;
      _machines.forEach((machine) => {
        $("#cfmaquinas").append(
          `<option value="${machine.id}">${machine.name}</option>`
        );
      });
    }
  );
});

/* Limpia  */

// inicializacion de datatable para la carga Fabril

var $tableCargaFabril = $("#table-cargaFabril").dataTable({
  scrollCollapse: true,
  pageLength: 25,

  language: {
    url: "/vendor/dataTables/Spanish.json",
  },
  ajax: {
    url: "api/get_carga_fabril.php?dataTable=true",
    dataSrc: "data",
  },
  columnDefs: [
    {
      targets: 0,
      className: "text-left",
    },
    {
      targets: 2,
      className: "text-right",
    },
  ],
  columns: [
    {
      data: "nombreMaquina",
      render: (data, type, row) => {
        return `<span class="name-left">${data}</span>`;
      },
    },
    {
      data: "insumo",
      render: (data, type, row) => {
        return `<span class="name-left">${data}</span>`;
      },
    },
    {
      data: "costo",
      render: function (data, type, row) {
        return `$ ${$.number(data, 0, ".", ",")}`;
      },
    },
    {
      data: "costoPorMinuto",
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
        return `<a href='#'><i id=${data.id} data-toggle='tooltip' title="Editar" class='nc-icon nc-refresh-69 link-editar' style='color:rgb(255, 165, 0)'></i></a><a href='#' style="margin-left: 1rem;"><i id=${data.id} class='nc-icon nc-simple-remove link-borrar' data-toggle='tooltip' title='Eliminar' style='color:rgb(255, 0, 0)'></i></a>`;
      },
    },
  ],
  reponsive: true,
});
$tableCargaFabril.width("100%");
/* $tableMaquinas.on('click', 'tr', function () {
  $(this).toggleClass('selected');
}) */

// formulario para adicionar o modificar valores de una maquina
$("#form-cargafabril").submit(submitForm);

// calcular depreciacion con el cambio de precio
$("#costoCargaFabril").keyup(calulateCostxMin);
elById("costoCargaFabril").oninput = calulateCostxMin;

function calulateCostxMin() {
  "use strict";
  let request = {
    price: $("#costoCargaFabril").val(),
  };
  $.get("api/get_costo_por_minuto.php", request, (data, status) => {
    if (status == "success") {
      if (parseFloat(data.costoPorMinuto) < 1) {
        let sum = 0;
        for (
          let index = 0;
          index < data.costoPorMinuto.toString().length;
          index++
        ) {
          sum += data.costoPorMinuto.toString().charAt(index) == "0" ? 1 : 0;
        }
        sum += 3;
        $("#minutoCargaFabril").val(
          Math.round10(parseFloat(data.costoPorMinuto), -sum)
        );
      } else {
        $(
          $("#minutoCargaFabril").val(
            Math.round10(parseFloat(data.costoPorMinuto), -2)
          )
        );
      }
    } else {
      location.href = "/login";
    }
  });
}
// agreado de formato al input de precio
$("#costoCargaFabril").number(true, 2);

function loadingSpinner() {
  $("#spinnerAjax").removeClass("fade");
}

function completeSpinner() {
  $("#spinnerAjax").addClass("fade");
}

/* document.getElementById("table-maquinas").addEventListener("click", (ev) => {
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
    console.log(depreciacion);
    const yearsDepreciation = selectedElement.dataset.maquinaYearsDeprec;
    const valorResidual = selectedElement.dataset.maquinaResidual;
    const idMaquina = selectedElement.dataset.maquinaId;

    elById("input-price-machine").value = pCompra;
    elById("input-valor-residual").value = parseFloat(valorResidual);
    elById("input-years-depreciation").value = yearsDepreciation;
    elById("costoCargaFabril").value = depreciacion;
    elById("input-maquinas").value = maquina;
    elById("machine-id").value = idMaquina;
  }
}); */

function submitForm(e, option, maquina) {
  e.preventDefault();
  maquina = $("#cfmaquinas").val();
  let insumo = $("#insumo").val();
  let costo = $("#costoCargaFabril").val();

  if (maquina === null || insumo === "" || costo === "") {
    return $.notify(
      {
        icon: "nc-icon nc-bell-55",
        message: "Ingrese <b>Todos</b> los campos",
      },
      {
        type: "danger",
        timer: 8000,
      }
    );
  }

  let request = $(this).serialize();
  sendData(request);
}

function sendData(request) {
  $.post("api/add_modify_carga_fabril.php", request).always(function (xhr) {
    flag = false;
    switch (xhr.status) {
      case 200:
        $.notify(
          {
            icon: "nc-icon nc-bell-55",
            message: "Carga Fabril <b>Actualizada</b>",
          },
          {
            type: "primary",
            timer: 8000,
          }
        );
        $tableCargaFabril.api().ajax.reload();
        break;
      case 201:
        $.notify(
          {
            icon: "nc-icon nc-bell-55",
            message: "Carga Fabril <b>Creada</b> Correctamente",
          },
          {
            type: "success",
            timer: 8000,
          }
        );
        $tableCargaFabril.api().ajax.reload();
        $("#form-cargafabril")[0].reset();
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
            message: "Ocurrió un error mientras se creaba la carga fabril",
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
            message: "El costo no puede ser 0 cero",
          },
          {
            type: "danger",
            timer: 8000,
          }
        );
        break;
    }
    if (flag == false) {
      elById("cargaFabril-btn").value = "ADICIONAR";
      elById("cargaFabril-btn").textContent = "ADICIONAR";
      elById("inlineRadio1CF").click();
      resetFormCargaFabril();
    }
  });
}

/* Eliminar carga fabril */

$(document).on("click", ".link-borrar", function (event) {
  let id = this.id;
  bootbox.confirm({
    title: "Eliminar Carga Fabril",
    message: `¿Está seguro de eliminar la carga fabril para esta máquina?.  Esta acción no se puede deshacer`,
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
        $.post("api/delete_cargaFabril.php", {
          id: id,
        }).always(function (xhr) {
          if (xhr.status == 200) {
            $.notify(
              {
                icon: "nc-icon nc-bell-55",
                message: "Se eliminó la carga fabril asociada a esa máquina",
              },
              {
                type: "info",
                timer: 8000,
              }
            );
            $tableCargaFabril.api().ajax.reload();
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
        resetFormCargaFabril();
        return;
      }
    },
  });
});

function deleteCargaFabril(id, maquina) {}

function formatCurrency(resultadoFloat) {
  return $.number(resultadoFloat, 2, ",", ".");
}

function resetFormCargaFabril() {
  elById("cfmaquinas").value = "";
  elById("insumo").value = "";
  elById("costoCargaFabril").value = "";
  elById("minutoCargaFabril").value = "";
}
/*
function checkIfMaquinaExists(name) {
  return Array.from(elById("table-maquinas").tBodies[0].rows).some(
    (row) => row.cells[0].textContent.trim() === name.trim()
  );
} */
