import { fillSelect } from "./utils/fillSelect.js";
import { Notifications, verifyFields } from "./utils/notifications.js";

const notifications = new Notifications();

let productsInProcess;

loadProductsPP();
function loadProductsPP() {
  $.get("api/get_products.php?process", (_products, status, xhr) => {
    if (status == "success") {
      fillSelect(
        "inputRefProcess",
        _products.map((product) => {
          return { value: product.id, description: product.ref };
        }),
        true,
        "Seleccione una referencia"
      );
      fillSelect(
        "inputProductProcess",
        _products.map((product) => {
          return { value: product.id, description: product.name };
        }),
        true,
        "Seleccione un producto"
      );
      productsInProcess = _products;

      $("#inputRefProcess").change(function () {
        let productSelected = productsInProcess.filter(
          (product) => product.id == $(this).val()
        )[0];

        $("#inputProductProcess").val(productSelected.id);
        $("#titleProductProcess").text(productSelected.name);
        cleanSelects();
        $tableProductProcess
          .api()
          .ajax.url(
            `api/get_product_processes.php?dataTable=true&id=${productSelected.id}`
          );
        $tableProductProcess.api().ajax.reload();
      });
      $("#inputProductProcess").change(function () {
        let productSelected = productsInProcess.filter(
          (product) => product.id == $(this).val()
        )[0];
        $("#inputRefProcess").val(productSelected.id);
        $("#titleProductProcess").text(productSelected.name);
        cleanSelects();
        $tableProductProcess
          .api()
          .ajax.url(
            `api/get_product_processes.php?dataTable=true&id=${productSelected.id}`
          );
        $tableProductProcess.api().ajax.reload();
      });
    }
  });
}

$.get(
  "/app/config-general/api/get_processes.php",
  (_processes, status, xhr) => {
    fillSelect(
      "selectProcess",
      _processes.map((process) => {
        return { value: process.id, description: process.name };
      }),
      true,
      "Seleccione un proceso"
    );
  }
);

$.get("/app/config-general/api/get_machines.php", (_machines, status, xhr) => {
  fillSelect(
    "selectMachines",
    _machines.map((mach) => {
      return { value: mach.id, description: mach.name };
    }),
    true,
    "Seleccione una máquina"
  );
});

function cleanSelects() {
  $("#selectMachines option[selected]").prop("selected", false);
  $("#selectMachines option[disabled]").prop("selected", "selected");
  $("#selectProcess option[selected]").prop("selected", false);
  $("#selectProcess option[disabled]").prop("selected", "selected");
  $("#tiempo-seg").val("");
  $("#input-unidad-hora").val("");
}

// agregado de listener para calcular el tiempo en segundos

$("#input-unidad-hora").on({
  keyup: () => {
    calculateTimeSeg();
  },
  change: () => {
    calculateTimeSeg();
  },
});

function calculateTimeSeg() {
  if ($("#input-unidad-hora").val() != "") {
    $("#tiempo-seg").val(Math.round10(60 / $("#input-unidad-hora").val(), -2));
  }
}

$("#input-tiempo-alistamiento").keyup(function (e) {
  e.preventDefault();
  totalTiempoProceso();
});

$("#input-tiempo-operacion").keyup(function (e) {
  e.preventDefault();
  totalTiempoProceso();
});

function totalTiempoProceso() {
  let operacion = $("#input-tiempo-operacion").val();
  let alistamiento = $("#input-tiempo-alistamiento").val();
  let tiempoTotal = parseFloat(operacion) + parseFloat(alistamiento);
  $("#input-tiempo-total").val(tiempoTotal);
}

$("#form-product-process").submit(function (e) {
  e.preventDefault();

  totalTiempoProceso();

  const producto = $("#inputProductProcess").val();
  const proceso = $("#selectProcess").val();
  const tiempoTotal = $("#input-tiempo-total").val();

  const fieldsVerification = verifyFields(
    {
      name: "Producto",
      value: producto,
    },
    {
      name: "Proceso",
      value: proceso,
    },
    {
      name: "Tiempo Total",
      value: tiempoTotal,
      message: "El <b>Tiempo Total</b> no puede ser cero (0)",
    }
  );

  if (fieldsVerification) {
    notifications.error(fieldsVerification.message);
    return false;
  }
  let request = $(this).serialize();
  $.post(
    "api/add_modify_product_process.php",
    request,
    (_data, _status, xhr) => {}
  ).always(function (xhr) {
    switch (xhr.status) {
      case 200:
        $.notify(
          {
            icon: "nc-icon nc-bell-55",
            message: "El Proceso ha sido <b>Actualizado</b> Correctamente",
          },
          {
            type: "primary",
            timer: 8000,
          }
        );
        $tableProductProcess.api().ajax.reload();
        clearTiemposProcesosForm();
        break;
      case 201:
        $.notify(
          {
            icon: "nc-icon nc-bell-55",
            message: "El proceso ha sido <b>Creado</b> Correctamente",
          },
          {
            type: "success",
            timer: 8000,
          }
        );
        $tableProductProcess.api().ajax.reload();
        clearTiemposProcesosForm();
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
            message: "Esta <b>Referencia</b> ya existe",
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
    /* } */
  });
});

// inicializacion de datatable de procesos por productos
var $tableProductProcess = $("#table-product-process").dataTable({
  scrollY: "500px",
  scrollCollapse: true,
  paging: false,

  language: {
    url: "/vendor/dataTables/Spanish.json",
  },
  responsive: true,
  ajax: {
    url: "api/get_product_processes.php?dataTable=true",
    dataSrc: "data",
  },
  columns: [
    {
      data: "process.name",
    },
    {
      data: "machine.name",
      render: (data, type, row) => {
        return data != null ? data : "N/A";
      },
    },
    {
      data: "timeAlistamiento",
      /* render: (data, type, row) => {
        return Math.round10(60 / data, -2);
      }, */
    },
    {
      data: "timeOperacion",
      /* render: (data, type, row) => {
        return Math.round10(data, -2);
      }, */
    },
    {
      data: "id",
      render: function (data) {
        return `<a href='#'><i data-prod-id=${data} data-toggle='tooltip' title="Editar" class='nc-icon nc-refresh-69 link-editar-procesos' style='color:rgb(255, 165, 0)'></i></a> <a href='#' style="margin-left: 1rem;"><i data-prod-id=${data} class='nc-icon nc-simple-remove link-borrar-procesos' data-toggle='tooltip' title='Eliminar' style='color:rgb(255, 0, 0)'></i></a>`;
      },
    },
  ],
});

$tableProductProcess.width("100%");

/* $tableProductProcess.on('click', 'tr', function () {
  $(this).toggleClass('selected');
}) */

// cargado de procesos cuando ya se encuentran creados

$("#selectProcess").change(function () {
  // listener para saber cuando cambia un proceso

  // traer el producto seleccionado
  let productSelected = productsInProcess.filter(
    (product) => product.id == $("#inputRefProcess").val()
  )[0];
  // verificacion de que haya un producto selecionado
  if (productSelected != undefined) {
    if (productSelected.processes != null) {
      let processSelected = productSelected.processes.filter(
        (process) => process.process.id == $(this).val()
      )[0];
      if (processSelected != undefined) {
        // seleccion de maquina
        if (processSelected.machine == null) {
          $("#selectMachines").val("NULL");
        } else {
          $("#selectMachines").val(processSelected.machine.id);
        }
        $("#tiempo-seg").val(
          Math.round10(parseFloat(processSelected.timeProcess), -2)
        );
        $("#input-unidad-hora").val(
          (60 / parseFloat(processSelected.timeProcess)).toFixed(2)
        );
        /*        $('#tiempo-seg').val(Math.round10(parseFloat(processSelected.timeProcess), -2))
               $('#input-unidad-hora').val(Math.round(60 / parseFloat(processSelected.timeProcess))) */
      } else {
        // limpiado de campos
        $("#selectMachines option[selected]").attr("selected", false);
        $("#selectMachines option[disabled]").attr("selected", "selected");
        /* $("#tiempo-seg").val("");
        $("#input-unidad-hora").val(""); */
      }
    }
  }
});

/* Actualizar procesos y maquinas en el producto */

$(document).on("click", ".link-editar-procesos", function (e) {
  e.preventDefault();

  let ref = $("#inputRefProcess").val();

  if (ref == null || ref == "") {
    $.notify(
      {
        icon: "nc-icon nc-bell-55",
        message: `Selecciona una </b>referencia</b>`,
      },
      {
        type: "danger",
        timer: 8000,
      }
    );
    return false;
  }

  let proceso = $(this).parents("tr").find("td").eq(0).html();
  let maquina = $(this).parents("tr").find("td").eq(1).html();
  let tiempoAlistamiento = $(this).parents("tr").find("td").eq(2).html();
  let tiempoOperacion = $(this).parents("tr").find("td").eq(3).html();

  $(`#selectProcess option:contains(${proceso})`).prop("selected", true);

  if (maquina == "N/A")
    $(`#selectMachines option:contains('Ninguna')`).prop("selected", true);
  else $(`#selectMachines option:contains(${maquina})`).prop("selected", true);

  $("#input-tiempo-alistamiento").val(tiempoAlistamiento);
  $("#input-tiempo-operacion").val(tiempoOperacion);
  totalTiempoProceso();
  $("#btnguardarproceso").html("Actualizar");
});

/* Desvincular materia prima del producto */

$(document).on("click", ".link-borrar-procesos", function (e) {
  e.preventDefault();
  const selectedElement = e.target;

  const element = $(this).parents("tr").find("td").eq(0).html();
  eliminar_procesos_productos(selectedElement.dataset.prodId, element);
});

// borrado de procesos
//$('#btn-delete-process').click(() => {
function eliminar_procesos_productos(element, proceso) {
  let producto = $("#inputProductProcess option:selected").html();

  if (producto == undefined || producto == "Selecciona un Producto")
    producto = "";

  bootbox.confirm({
    title: "Desvincular procesos",
    message: `¿Desea desvincular el proceso <b>${proceso}</b> del producto <b>${producto}</b>?. Esta acción no se puede deshacer`,
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
        /* let rows = $tableProductProcess.api().rows('.selected').data()
          let count = 0
          let countAux = 0
          if (rows.length > 0) { 
            for (let index = 0; index < rows.length; index++) {*/
        $.post("api/delete_product_process.php", {
          //id: rows[index].id
          id: element,
        }).always(function (xhr) {
          //countAux++
          if (xhr.status == 200) {
            //count++
            //}
            //if (countAux == rows.length) {
            $tableProductProcess.api().ajax.reload();
            $.notify(
              {
                icon: "nc-icon nc-bell-55",
                //message: `Se ${count > 1 ? 'han' : 'ha'} borrado ${count} ${count > 1 ? 'procesos' : 'proceso'}`
                message: `Proceso <b>${proceso}</b> desvinculado del producto <b>${producto}</b>`,
              },
              {
                type: "info",
                timer: 8000,
              }
            );
          }
        });
        /*   }
          } else {
           $.notify({
             icon: "nc-icon nc-bell-55",
             message: `Selecciona al menos <b>1</b> proceso`
           }, {
             type: 'warning',
             timer: 8000
           })
         } */
        //})
      }
    },
  });
}

function clearTiemposProcesosForm() {
  cleanSelects();
  $("#selectMachines").val("");
  $("#input-tiempo-alistamiento").val("");
  $("#input-tiempo-operacion").val("");
  $("#input-tiempo-total").val("");
  $("#btnguardarproceso").html("Guardar");
}
