verifySettedConfiguration("tabCargaFabril");

$(".link-borrar-carga-fabril").css("cursor", "pointer");

$("#cfmaquinas").focus(function () {
  $.get(
    "/app/config-general/api/get_machines.php",
    (_machines, status, xhr) => {
      $("#cfmaquinas").append(
        `<option selected disabled>Selecciona un máquina</option>`
      );
      _machines.forEach((machine) => {
        $("#cfmaquinas").append(
          `<option value="${machine.id}">${machine.name}</option>`
        );
      });
    }
  );
});

/* Limpia campos si se cambia seleccion de maquina */

$("#cfmaquinas").change(function (e) {
  e.preventDefault();
  resetFormCargaFabril();
});

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
      data: "mantenimiento",
      render: (data, type, row) => {
        return `<span class="name-left">${data}</span>`;
      },
    },
    {
      data: "costo",
      render: function (data, type, row) {
        return PriceParser.toString(data, true, 0).strPrice;
      },
    },
    {
      data: "costoPorMinuto",
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
        return `<a href='#'><i id=${data.id} data-toggle='tooltip' title="Editar" class='nc-icon nc-refresh-69 link-editar-carga-fabril' style='color:rgb(255, 165, 0)'></i></a><a href='#' style="margin-left: 1rem;"><i id=${data.id} class='nc-icon nc-simple-remove link-borrar-carga-fabril' data-toggle='tooltip' title='Eliminar' style='color:rgb(255, 0, 0)'></i></a>`;
      },
    },
  ],
  reponsive: true,
});
$tableCargaFabril.width("100%");

$("#costoCargaFabril").keyup(calcularCostoPorMinuto);
$("#costoCargaFabril").change(calcularCostoPorMinuto);
$("#form-cargafabril").submit(submitForm);

function calcularCostoPorMinuto() {
  const costoPriceParsed = PriceParser.fromString(
    $("#costoCargaFabril").val(),
    false,
    0
  );
  let request = {
    price: costoPriceParsed.price,
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
  // agreado de formato al input de precio
  $("#costoCargaFabril").val(costoPriceParsed.strPrice);
}

function loadingSpinner() {
  $("#spinnerAjax").removeClass("fade");
}

function completeSpinner() {
  $("#spinnerAjax").addClass("fade");
}

/* Envio de formulario */

function submitForm(e) {
  e.preventDefault();

  let cargas = $tableCargaFabril.dataTable().api().ajax.json().data;

  let maquina = $("#cfmaquinas").val();
  let mantenimiento = $("#mantenimiento").val();
  let costoParsed = PriceParser.fromString(
    $("#costoCargaFabril").val(),
    false,
    0
  );
  let costo = costoParsed.price;

  if (maquina === null || mantenimiento === "") {
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
  } else if (!costo) {
    return $.notify(
      {
        icon: "nc-icon nc-bell-55",
        message: "El costo no puede ser 0 cero",
      },
      {
        type: "danger",
        timer: 8000,
      }
    );
  }
  $("#costoCargaFabril").val(costo);

  let request = $(this).serialize();

  let cargaExiste = cargas.find((carga) => {
    return carga.idMaquina == maquina && carga.mantenimiento == mantenimiento;
  });
  if (cargaExiste) {
    bootbox.confirm({
      title: "Actualizar Carga Fabril",
      message: `La Carga <b>"${cargaExiste.mantenimiento}" de la máquina ${cargaExiste.nombreMaquina}</b> ya existe, ¿Desea actualizarla?`,
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
          let idCarga = $("#idCargaFabril").val();
          if (!idCarga) {
            $("#idCargaFabril").val(cargaExiste.id);
            idCarga = cargaExiste.id;
          }

          sendData(request + `&idCargaFabril=${idCarga}`);
        } else {
          return;
        }
      },
    });
  } else {
    sendData(request);
  }
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
        resetFormCargaFabril();
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
        resetFormCargaFabril();
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
      elById("cfmaquinas").value = "";
      resetFormCargaFabril();
    }
  });
}

/* Actualizar carga fabril */
$(document).on("click", ".link-editar-carga-fabril", function (event) {
  event.preventDefault();
  $("#idCargaFabril").val(this.id);
  maquina = $(this).parents("tr").find("td").eq(0).text();
  mantenimiento = $(this).parents("tr").find("td").eq(1).text();
  let costoParsed = PriceParser.fromString(
    $(this).parents("tr").find("td").eq(2).html(),
    true,
    0
  );

  $(`#cfmaquinas option:contains(${maquina})`).prop("selected", true);
  $("#mantenimiento").val(mantenimiento);
  $("#costoCargaFabril").val(costoParsed.strPrice);
  $("#cargaFabril-btn").html("Actualizar");
  calcularCostoPorMinuto();
});

/* Eliminar carga fabril */
$(document).on("click", ".link-borrar-carga-fabril", function (event) {
  event.preventDefault();

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
        elById("cfmaquinas").value = "";
        resetFormCargaFabril();
        return;
      }
    },
  });
});

function resetFormCargaFabril() {
  elById("mantenimiento").value = "";
  $("#costoCargaFabril").val("0");
  $("#minutoCargaFabril").val("0");
  $("#idCargaFabril").val("");
}
