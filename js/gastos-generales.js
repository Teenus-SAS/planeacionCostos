/* 
@Author: Teenus SAS
@github: Teenus-SAS
logica de gastos generales
*/
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

function goGG() {
  $("#nav-gastos").trigger("click");
}
