/**
 * @author  Teenus SAS
 * @github Teenus SAS
 * logica de procesos por productos
 * permite agregar, modificar y eliminar procesos asociados un productos
 */

// variables de ambito global
var productsInProcess;

loadProductsPP();
function loadProductsPP() {
  // cargado de productos la empresa
  loadingSpinner();
  $.get("api/get_products.php?process", (_products, status, xhr) => {
    completeSpinner();
    // se consulta los productos de esa empresa
    if (status == "success") {
      // se agregan todos los productos en un input select
      $("#inputRefProcess").html("<option disabled selected>Selecciona una Referencia</option>");
      $("#inputProductProcess").html("<option disabled selected>Selecciona un Producto</option>");
      productsInProcess = _products;
      productsInProcess.forEach((product) => {
        $("#inputRefProcess").append(
          `<option value="${product.id}">${product.ref}</option>`
        );
        $("#inputProductProcess").append(
          `<option value="${product.id}">${product.name}</option>`
        );
      });

      $("#inputRefProcess").change(function () {
        let productSelected = productsInProcess.filter(
          (product) => product.id == $(this).val()
        )[0];
        
        $("#inputProductProcess").val(productSelected.id);
        //$("#titleProductProcess").text(productSelected.name);
        cleanSelects();
        $tableProductProcess
          .api()
          .ajax.url(
            `api/get_product_processes.php?dataTable=true&id=${productSelected.id}`
          );
        $tableProductProcess.api().ajax.reload();
      });
      /*       $('#inputProductProcess').change(function () {
              let productSelected = productsInProcess.filter(product => product.id == $(this).val())[0]
              $('#inputRefProcess').val(productSelected.id)
              $('#titleProductProcess').text(productSelected.name)
              cleanSelects()
              $tableProductProcess.api().ajax.url(`api/get_product_processes.php?dataTable=true&id=${productSelected.id}`)
              $tableProductProcess.api().ajax.reload()
            }) */
    }
  });
}

// cargado de procesos

$.get(
  "/app/config-general/api/get_processes.php",
  (_processes, status, xhr) => {
    $("#selectProcess").append(
      `<option selected disabled>Selecciona un proceso</option>`
    );
    processesJSON = _processes;
    _processes.forEach((process) => {
      $("#selectProcess").append(
        `<option value="${process.id}">${process.name}</option>`
      );
    });
  }
);

// cargado de maquinas

$.get("/app/config-general/api/get_machines.php", (_machines, status, xhr) => {
  $("#selectMachines").append(
    `<option selected disabled>Selecciona un máquina</option><option value="NULL">Ninguna</option>`
  );
  machinesJSON = _machines;
  _machines.forEach((machine) => {
    $("#selectMachines").append(
      `<option value="${machine.id}">${machine.name}</option>`
    );
  });
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

/* Suma total de tiempo de proceso */

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

// enviado de formulario

$("#form-product-process").submit(function (e) {
  e.preventDefault();

  let request = $(this).serialize();
  //request += `&timeProcess=${60 / $("#input-unidad-hora").val()}`;
  $.post(
    "api/add_modify_product_process.php",
    request,
    (_data, _status, xhr) => {}
    ).always(function (xhr) {
      /* if ($("#input-unidad-hora").val().length <= 0) {
        $.notify(
          {
            icon: "nc-icon nc-bell-55",
            message: "Ingresa las Unidades/Hora",
          },
          {
            type: "warning",
            timer: 8000,
          }
          );
        } else if (parseFloat($("#input-unidad-hora").val()) == 0) {
          $.notify(
            {
              icon: "nc-icon nc-bell-55",
              message: "Unidades/Hora deben ser mayor a 0",
            },
            {
              type: "warning",
              timer: 8000,
            }
            );
          } else { */
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
        loadProductsPP();
        $("#selectProcess").val("");
        $("#selectMachines").val("");
        $("#input-tiempo-alistamiento").val("");
        $("#input-tiempo-operacion").val("");
        $("#input-tiempo-total").val("");
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
        $("#form-product-process")[0].reset();
        //loadProductsPP();
        break;
      case 412:
        $.notify(
          {
            icon: "nc-icon nc-bell-55",
            message:
              "<b>selecciona</b> una opción para <b>adicionar</b> o <b>modificar</b>",
          },
          {
            type: "warning",
            timer: 8000,
          }
        );
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

  ref = $("#inputRefProcess").val();

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

  proceso = $(this).parents("tr").find("td").eq(0).html();
  maquina = $(this).parents("tr").find("td").eq(1).html();
  tiempoAlistamiento = $(this).parents("tr").find("td").eq(2).html();
  tiempoOperacion = $(this).parents("tr").find("td").eq(3).html();

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

  element = $(this).parents("tr").find("td").eq(0).html();
  eliminar_procesos_productos(selectedElement.dataset.prodId, element);
});

// borrado de procesos
//$('#btn-delete-process').click(() => {
function eliminar_procesos_productos(element, proceso) {
  producto = $("#inputProductProcess option:selected").html();

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
