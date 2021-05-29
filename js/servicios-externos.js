import { fillSelect } from "./utils/fillSelect.js";
import { Notifications, verifyFields } from "./utils/notifications.js";

$(".link-borrar-servicio-externo").css("cursor", "pointer");

$(document).ready(function () {
  $.get(
    "/app/config-general/api/get_products.php",
    (_products, status, xhr) => {
      fillSelect(
        "cfproductos",
        _products.map((product) => {
          return { value: product.id, description: product.name };
        }),
        true,
        "Selecciona un producto"
      );
    }
  );
});

var $tableServiciosExternos = $("#table-serviciosExternos").dataTable({
  scrollCollapse: true,
  pageLength: 25,
  language: {
    url: "/vendor/dataTables/Spanish.json",
  },
  ajax: {
    url: "api/get_servicio_externo_by_product_id.php?dataTable=true",
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
      data: "nombreServicio",
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
      data: null,
      render: function (data) {
        return `<a href='#'><i id=${data.id} data-toggle='tooltip' title="Editar" class='nc-icon nc-refresh-69 link-editar-servicio-externo' style='color:rgb(255, 165, 0)'></i></a><a href='#' style="margin-left: 1rem;"><i id=${data.id} class='nc-icon nc-simple-remove link-borrar-servicio-externo' data-toggle='tooltip' title='Eliminar' style='color:rgb(255, 0, 0)'></i></a>`;
      },
    },
  ],
  reponsive: true,
});

/* Limpia campos y cargar servicios si se cambia seleccion de producto */

$("#cfproductos").change(function (e) {
  e.preventDefault();

  $tableServiciosExternos
    .api()
    .ajax.url(
      `api/get_servicio_externo_by_product_id.php?dataTable=true&id=${$(
        "#cfproductos"
      ).val()}`
    );

  $tableServiciosExternos.api().ajax.reload();
  $("#servicioexterno").val("");
  $("#costoServicioExterno").val("");
  $("#serviciosExternos-btn").html("Adicionar");
});
$tableServiciosExternos.width("100%");
/* $tableMaquinas.on('click', 'tr', function () {
  $(this).toggleClass('selected');
}) */

$("#form-serviciosExternos").submit(submitForm);

// agreado de formato al input de precio
$("#costoServicioExterno").number(true, 2);

function submitForm(e) {
  e.preventDefault();
  const producto = $("#cfproductos").val();
  const nombre = $("#servicioexterno").val();
  const costoParsed = PriceParser.fromString($("#costoServicioExterno").val());

  const fieldsVerification = verifyFields(
    {
      name: "Producto",
      value: producto,
    },
    {
      name: "Servicio Externo",
      value: nombre,
    },
    {
      name: "Costo",
      value: costoParsed.price ? costoParsed.price : "",
    }
  );

  if (fieldsVerification) {
    Notifications.error(fieldsVerification.message);
    return false;
  }

  let request = $(this).serialize();
  sendData(request);
}

function sendData(request) {
  $.post("api/add_modify_servicio_externo.php", request).always(function (xhr) {
    switch (xhr.status) {
      case 200:
        $.notify(
          {
            icon: "nc-icon nc-bell-55",
            message: "Servicio Externo <b>Actualizado</b>",
          },
          {
            type: "primary",
            timer: 8000,
          }
        );
        $tableServiciosExternos.api().ajax.reload();
        resetFormServiciosExternos();
        break;
      case 201:
        $.notify(
          {
            icon: "nc-icon nc-bell-55",
            message: "Servicio Externo <b>Creado</b> Correctamente",
          },
          {
            type: "success",
            timer: 8000,
          }
        );
        $tableServiciosExternos.api().ajax.reload();
        resetFormServiciosExternos();
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
            message: "Ocurrió un error mientras se creaba el servicio externo",
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
  });
}

/* Actualizar servicio externo */

$(document).on("click", ".link-editar-servicio-externo", function (event) {
  event.preventDefault();

  $("#idServicioExterno").val(this.id);
  const nombre = $(this).parents("tr").find("td").eq(0).text();
  let costoParsed = PriceParser.fromString(
    $(this).parents("tr").find("td").eq(1).html(),
    true,
    0
  );
  $("#servicioexterno").val(nombre);
  $("#costoServicioExterno").val(costoParsed.strPrice);
});

/* Eliminar servicio externo */

$(document).on("click", ".link-borrar-servicio-externo", function (event) {
  event.preventDefault();

  let id = this.id;

  bootbox.confirm({
    title: "Eliminar Servicio Externo",
    message: `¿Está seguro de eliminar el Servicio Externo para este producto?.  Esta acción no se puede deshacer`,
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
        $.post("api/delete_servicio_externo.php", {
          id: id,
        }).always(function (xhr) {
          if (xhr.status == 200) {
            $.notify(
              {
                icon: "nc-icon nc-bell-55",
                message:
                  "Se eliminó el Servicio Externo asociado a ese producto",
              },
              {
                type: "info",
                timer: 8000,
              }
            );
            $tableServiciosExternos.api().ajax.reload();
          }
        });
      } else {
        resetFormServiciosExternos();
        return;
      }
    },
  });
});

function resetFormServiciosExternos() {
  $("#servicioexterno").val("");
  $("#costoServicioExterno").val("");
  $("#idServicioExterno").val("");
}
