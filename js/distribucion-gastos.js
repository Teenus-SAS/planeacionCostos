import { fetchData } from "./utils/fetchData.js";
import { fillSelect } from "./utils/fillSelect.js";
import { loadDatafromEndpoint } from "./utils/loadData.js";

const getDistribucionesDirectas = async () =>
  (await fetchData("/app/products/api/get_distribuciones_directas.php")).data;

loadMonthExpenses();
function loadMonthExpenses() {
  loadDatafromEndpoint(
    "api/get_total_month_expenses.php",
    (data) => {
      $("#inputGastosGenerales").val(data.totalMonthExpenses);
      $("#inputGastosGeneralesDirecta").val(data.totalMonthExpenses);
      $("#inputGastosGenerales").number(true, 2, ",", ".");
      $("#inputGastosGeneralesDirecta").number(true, 2, ",", ".");
    },
    () => {
      location.href = "/app";
    }
  );
}

var productsInExpenses;
loadProductsGG();
function loadProductsGG() {
  loadingSpinner();
  $.get("api/get_products.php?expenses", (_products, status, xhr) => {
    // se consulta los productos de esa empresa
    if (status == "success") {
      fillSelect(
        "inputRefGastos",
        _products.map((product) => {
          return { value: product.id, description: product.ref };
        }),
        true,
        "Seleccione una referencia"
      );
      fillSelect(
        "inputProductosGastos",
        _products.map((product) => {
          return { value: product.id, description: product.name };
        }),
        true,
        "Seleccione un producto"
      );
      productsInExpenses = _products;

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

document.getElementById("inputProcesosDDirecta").onchange = (e) => {
  clearDDirectaForm(false);
};

let processesDDirecta;
loadProcessesDDirecta();
// cargado de procesos de la empresa
function loadProcessesDDirecta() {
  loadingSpinner();
  $.get(
    "/app/config-general/api/get_processes.php",
    (processes, status, xhr) => {
      if (status == "success") {
        processesDDirecta = processes;
        fillSelect(
          "inputProcesosDDirecta",
          processes.map((process) => {
            return { value: process.id, description: process.name };
          }),
          true,
          "Seleccione un proceso"
        );

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
let $tableGastosMensuales = $("#tableGastosMensuales").dataTable({
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
  const gastosGeneralesParsed = PriceParser.fromString(
    $("#inputGastosGenerales").val()
  );
  request = request + `&gastosGenerales=${gastosGeneralesParsed.price}`;
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
        clearDVolumenForm();
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
        clearDVolumenForm();
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
let $tableDistribucionDirecta = $("#tableDistribucionDirecta").dataTable({
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
      data: null,
      render: function (data) {
        return `<a href='#'><i id=${data.id} data-toggle='tooltip' title="Editar" class='nc-icon nc-refresh-69 link-editar-distribucion-directa' style='color:rgb(255, 165, 0)'></i></a><a href='#' style="margin-left: 1rem;"><i id=${data.id} class='nc-icon nc-simple-remove link-borrar-distribucion-directa' data-toggle='tooltip' title='Eliminar' style='color:rgb(255, 0, 0)'></i></a>`;
      },
    },
  ],
  responsive: true,
  footerCallback: function (row, data, start, end, display) {
    let api = this.api();

    let intVal = function (i) {
      return typeof i === "string"
        ? i.replace(/[\$,]/g, "") * 1
        : typeof i === "number"
        ? i
        : 0;
    };

    let total = api
      .column(1)
      .data()
      .reduce(function (a, b) {
        return intVal(a) + intVal(b);
      }, 0);

    let pageTotal = api
      .column(1, { page: "current" })
      .data()
      .reduce(function (a, b) {
        return intVal(a) + intVal(b);
      }, 0);

    $(api.column(1).footer()).html(
      `${$.number(pageTotal * 100, 2, ".", ",")} %`
    );

    total = api
      .column(2)
      .data()
      .reduce(function (a, b) {
        return intVal(a) + intVal(b);
      }, 0);

    pageTotal = api
      .column(2, { page: "current" })
      .data()
      .reduce(function (a, b) {
        return intVal(a) + intVal(b);
      }, 0);

    $(api.column(2).footer()).html(`$ ${$.number(pageTotal, 2, ".", ",")}`);
  },
});

/* Actualizar distribucion directa */
$(document).on(
  "click",
  ".link-editar-distribucion-directa",
  async function (event) {
    event.preventDefault();

    $("#idDistribucionDirecta").val(this.id);
    const distribuciones = await getDistribucionesDirectas();
    const dist = distribuciones.find(
      (distribution) => distribution.id == this.id
    );

    $("#isProcesoInterno").prop(
      "checked",
      dist.isProcesoInterno ? true : false
    );

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
  }
);

/* Eliminar distribucion directa */
$(document).on("click", ".link-borrar-distribucion-directa", function (event) {
  event.preventDefault();

  let id = this.id;

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
                message: "Registro Eliminado Correctamente",
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
  e.preventDefault();
  const porcentaje = parseFloat($("#inputPorcentajeProceso").val());
  const proceso = $(`#inputProcesosDDirecta`).val();

  if (!proceso) {
    $.notify(
      {
        icon: "nc-icon nc-bell-55",
        message: "Campo <b>Proceso</b> es requerido",
      },
      {
        type: "danger",
        timer: 8000,
      }
    );
    return;
  }
  if (!porcentaje) {
    $.notify(
      {
        icon: "nc-icon nc-bell-55",
        message: "Porcentaje no puede ser cero (0)",
      },
      {
        type: "danger",
        timer: 8000,
      }
    );
    return;
  }
  loadingSpinner();
  let request = $(this).serialize();

  const gastosGeneralesParsed = PriceParser.fromString(
    $("#inputGastosGeneralesDirecta").val()
  );
  request = request + `&gastosGenerales=${gastosGeneralesParsed.price}`;

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
            message:
              "El proceso ha sido <bProceso>Actualizado</bProceso> Correctamente",
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
            type: "success",
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

function clearDDirectaForm(clearInput = true) {
  if (clearInput) {
    $(`#inputProcesosDDirecta`).prop("selectedIndex", 0);
  }
  $("#inputPorcentajeProceso").val("");
  $("#idDistribucionDirecta").val("");
  $("#isProcesoInterno").prop("checked", false);
  $("#btnAddModifyDDirecta").html("Guardar");
}

function clearDVolumenForm() {
  $("#inputRefGastos").prop("selectedIndex", 0);
  $("#inputProductosGastos").prop("selectedIndex", 0);
  $("#inputUnidadesVendidas").val("");
  $("#inputVolumenVentas").val("");
  $("#btnAddModifyDDirecta").html("Guardar");
}

// Comprobar si ya está guardado en opciones
$.get("api/get_opciones_empresa.php", (data) => {
  if (data) {
    if (data.tipoDistribucion == "1") {
      selectDistribution("#distribucion-volumen");
    } else if (data.tipoDistribucion == "0") {
      selectDistribution("#distribucion-directa");
    }
  }
});

$("#select-distibution").addClass("showSelectDistribution");
function selectDistribution(distribution) {
  $(distribution).removeClass("hide");
  $(distribution).addClass("show");

  $.post("api/update_opciones_empresa.php", {
    tipoDistribucion: distribution == "#distribucion-directa" ? 0 : 1,
  });

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

function loadingSpinner() {
  $("#spinnerAjax").removeClass("fade");
}

function completeSpinner() {
  $("#spinnerAjax").addClass("fade");
}
