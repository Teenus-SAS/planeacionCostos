/* 
@Author: Teenus SAS
@github: Teenus-SAS
logica de gastos generales
*/

loadMonthExpenses();
// cargado de valor de gastos mensuales
function loadMonthExpenses() {
  $.get("api/get_total_month_expenses.php", (data, status) => {
    if (status == "success") {
      $("#inputGastosGenerales").val(data.totalMonthExpenses);
      // formato de numero
      $("#inputGastosGenerales").number(true, 2, ",", ".");
    } else {
      location.href = "/app";
    }
  });
}

var productsInExpenses;
loadProductsGG();
// cargado de productos la empresa
function loadProductsGG() {
  loadingSpinner();
  $.get("api/get_products.php?expenses", (_products, status, xhr) => {
    // se consulta los productos de esa empresa
    if (status == "success") {
      // se agregan todos los productos en un input select
      $("#inputRefGastos").html(
        "<option disabled selected>Selecciona una Referencia</option>"
      );
      $("#inputProductosGastos").html(
        "<option disabled selected>Selecciona un Producto</option>"
      );
      productsInExpenses = _products;
      productsInExpenses.forEach((product) => {
        $("#inputRefGastos").append(
          `<option value="${product.id}">${product.ref}</option>`
        );
        $("#inputProductosGastos").append(
          `<option value="${product.id}">${product.name}</option>`
        );
      });

      $("#inputRefGastos").change(function () {
        let productSelected = productsInExpenses.filter(
          (product) => product.id == $(this).val()
        )[0];
        $("#inputProductosGastos").val(productSelected.id);
        $("#titleProductProcess").text(productSelected.name);
        loadfields(productSelected.expenses);
      });
      $("#inputProductosGastos").change(function () {
        let productSelected = productsInExpenses.filter(
          (product) => product.id == $(this).val()
        )[0];
        $("#inputRefGastos").val(productSelected.id);
        $("#titleProductProcess").text(productSelected.name);
        loadfields(productSelected.expenses);
      });
      $tableGastosMensuales.api().ajax.reload();
    }
  });
  completeSpinner();
}

var processesDDirecta;
loadProcessesDDirecta();
// cargado de procesos de la empresa
function loadProcessesDDirecta() {
  loadingSpinner();
  $.get(
    "/app/config-general/api/get_processes.php",
    (processes, status, xhr) => {
      if (status == "success") {
        $("#inputProcesosDDirecta").html(
          "<option disabled selected>Selecciona un proceso</option>"
        );
        processesDDirecta = processes;
        processesDDirecta.forEach((process) => {
          $("#inputProcesosDDirecta").append(
            `<option value="${process.id}">${process.name}</option>`
          );
        });

        $tableDistribucionDirecta.api().ajax.reload();
      }
    }
  );
  completeSpinner();
}

//cargado de datos en los campos
function loadfields(expenses) {
  $("#inputVolumenVentas").val(expenses.turnOver);
  $("#inputUnidadesVendidas").val(expenses.soldUnits);
  //formato de numero
  $("#inputVolumenVentas").number(true, 2);
  $("#inputUnidadesVendidas").number(true, 0);
}

// inicializacion de datatable de gastos generales
var $tableGastosMensuales = $("#tableGastosMensuales").dataTable({
  scrollY: "500px",
  scrollCollapse: true,
  paging: false,

  language: {
    url: "/vendor/dataTables/Spanish.json",
  },
  ajax: {
    url: "api/get_products.php?dataTable=true&expenses",
    dataSrc: "data",
  },
  columnDefs: [
    {
      targets: [2, 3, 4],
      className: "text-right",
    },
  ],
  columns: [
    { data: "ref" },
    { data: "name" },
    {
      data: "expenses.soldUnitsPercentage",
      render: function (data, type, row) {
        return `${$.number(data, 2, ",", ".")} %`;
      },
    },
    {
      data: "expenses.salesVolumePercentage",
      render: function (data, type, row) {
        return `${$.number(data, 2, ",", ".")} %`;
      },
    },
    {
      data: "expenses.unitAssignableExpense",
      render: function (data, type, row) {
        return `$ ${$.number(data, 2, ",", ".")}`;
      },
    },
  ],
  responsive: true,
});
$tableGastosMensuales.width("100%");
$tableGastosMensuales.on("click", "tr", function () {
  $(this).toggleClass("selected");
});
// formulario para actulizar gastos de productos
$("#formGastosMensuales").submit(function (e) {
  loadingSpinner();
  e.preventDefault();
  let request = $(this).serialize();
  $.post(
    "api/modify_expenses_product.php",
    request,
    (_data, _status, xhr) => {}
  ).always(function (xhr) {
    completeSpinner();
    switch (xhr.status) {
      case 200:
        $.notify(
          {
            icon: "nc-icon nc-bell-55",
            message: "El producto ha sido <b>Actualizado</b> Correctamente",
          },
          {
            type: "primary",
            timer: 8000,
          }
        );
        $tableGastosMensuales.api().ajax.reload();
        loadMonthExpenses();
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
  });
});

// inicializacion de datatable de DISTRIBUCIÓN DIRECTA
var $tableDistribucionDirecta = $("#tableDistribucionDirecta").dataTable({
  scrollY: "500px",
  scrollCollapse: true,
  paging: false,
  language: {
    url: "/vendor/dataTables/Spanish.json",
  },
  ajax: {
    url: "api/get_distribuciones_directas.php?dataTable=true",
    dataSrc: "data",
  },
  columnDefs: [
    {
      targets: [2, 3, 4],
      className: "text-right",
    },
    {
      targets: [0],
      className: "text-left",
    },
  ],
  columns: [
    { data: "nombreProceso" },
    {
      data: "porcentaje",
      render: function (data, type, row) {
        return `${$.number(data * 100, 2, ",", ".")} %`;
      },
    },
    {
      data: "valorProceso",
      render: function (data, type, row) {
        return `$ ${$.number(data, 2, ",", ".")}`;
      },
    },
    {
      data: "valorMinuto",
      render: function (data, type, row) {
        return `$ ${$.number(data, 2, ",", ".")}`;
      },
    },
    {
      data: "valorAsignado",
      render: function (data, type, row) {
        return `$ ${$.number(data, 2, ",", ".")}`;
      },
    },
    {
      data: null,
      render: function (data) {
        return `<a href='#'><i id=${data.id} data-toggle='tooltip' title="Editar" class='nc-icon nc-refresh-69 link-editar-distribucion-directa' style='color:rgb(255, 165, 0)'></i></a><a href='#' style="margin-left: 1rem;"><i id=${data.id} class='nc-icon nc-simple-remove link-borrar-distribucion-directa' data-toggle='tooltip' title='Eliminar' style='color:rgb(255, 0, 0)'></i></a>`;
      },
    },
  ],
  responsive: true,
});
$tableDistribucionDirecta.width("100%");

/* Actualizar distribucion directa */
$(document).on("click", ".link-editar-distribucion-directa", function (event) {
  event.preventDefault();

  $("#idDistribucionDirecta").val(this.id);
  let proceso = $(this).parents("tr").find("td").eq(0).text();
  let porcentaje = parseFloat(
    $(this)
      .parents("tr")
      .find("td")
      .eq(1)
      .html()
      .replace("%", "")
      .replace(",", ".")
  );

  $(`#inputProcesosDDirecta option:contains(${proceso})`).prop(
    "selected",
    true
  );
  $("#inputPorcentajeProceso").val(porcentaje);
  $("#btnAddModifyDDirecta").html("Actualizar");
});

/* Eliminar distribucion directa */
$(document).on("click", ".link-borrar-distribucion-directa", function (event) {
  event.preventDefault();

  let id = this.id;
  console.log({ id });

  bootbox.confirm({
    title: "Eliminar Distribución Directa",
    message: `¿Está seguro de eliminar la distribución?.  Esta acción no se puede deshacer`,
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
        $.post("api/delete_distribucion_directa.php", {
          id: id,
        }).always(function (xhr) {
          if (xhr.status == 200) {
            $.notify(
              {
                icon: "nc-icon nc-bell-55",
                message: "Se eliminó la distribución directa",
              },
              {
                type: "info",
                timer: 8000,
              }
            );
            $tableDistribucionDirecta.api().ajax.reload();
          }
        });
      }
    },
  });
});

// formulario para crear una distribución directa
$("#formDistribucionDirecta").submit(function (e) {
  loadingSpinner();
  e.preventDefault();
  let request = $(this).serialize();
  console.log(request);
  $.post(
    "api/add_modify_distribucion_directa.php",
    request,
    (_data, _status, xhr) => {}
  ).always(function (xhr) {
    completeSpinner();
    switch (xhr.status) {
      case 200:
        $.notify(
          {
            icon: "nc-icon nc-bell-55",
            message: "El proceso ha sido <b>Actualizado</b> Correctamente",
          },
          {
            type: "primary",
            timer: 8000,
          }
        );
        $tableDistribucionDirecta.api().ajax.reload();
        clearDDirectaForm();
        break;
      case 201:
        $.notify(
          {
            icon: "nc-icon nc-bell-55",
            message: "El proceso ha sido <b>Creado</b> Correctamente",
          },
          {
            type: "primary",
            timer: 8000,
          }
        );
        $tableDistribucionDirecta.api().ajax.reload();
        clearDDirectaForm();
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
      case 401:
        location.href = "/login";
        break;
    }
  });
});

function clearDDirectaForm() {
  $(`#inputProcesosDDirecta`).prop("selectedIndex", 0);
  $("#inputPorcentajeProceso").val("");
  $("#btnAddModifyDDirecta").html("Guardar");
}

function goGG() {
  $("#nav-gastos").trigger("click");
}

$("#select-distibution").addClass("showSelectDistribution");
function selectDistribution(distribution) {
  $(distribution).removeClass("hide");
  $(distribution).addClass("show");

  $("#select-distibution").removeClass("showSelectDistribution");
  $("#select-distibution").addClass("hideSelectDistribution");
}

$("#select-distibution .card").on("click", function () {
  let strDistribution = "";
  if (this.id == "select-directa") {
    strDistribution = "#distribucion-directa";
  } else if (this.id == "select-volumen") {
    strDistribution = "#distribucion-volumen";
  }

  bootbox.confirm({
    title: "Selección distribución de gastos",
    message: `¿Está seguro de que desea elegir la <b>distribución ${
      strDistribution.includes("directa") ? "directa" : "por volumen"
    }</b>?.<br/>Esta acción no se puede deshacer`,
    buttons: {
      confirm: {
        label: '<i class="fa fa-check"></i> Si',
        className: "btn-info",
      },
      cancel: {
        label: '<i class="fa fa-times"></i> No',
        className: "btn-danger",
      },
    },
    callback: function (result) {
      if (result == true) {
        selectDistribution(strDistribution);
      }
    },
  });
});
