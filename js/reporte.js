import { GetOpcionesEmpresa } from "./OpcionesEmpresa/application/get_opciones_actual_session/GetOpcionesEmpresa.js";

let productsReq = JSON.parse(sessionStorage.getItem("products"));

var dollar = 0;
$("#dollar").load("api/page_dollar.php #cc-ratebox", (data, status, xhr) => {
  strDollar = $("#dollar #cc-ratebox").text();
  strDollar = strDollar.substring(10, strDollar.length);
  strDollar = strDollar.replace(".", "", "gi");
  strDollar = strDollar.replace(",", ".", "gi");
  dollar = parseFloat(strDollar);
  $("#input-dollar").val(strDollar.replace(".", ",", "gi"));
  $("#input-dollar").number(true, 2, ",", ".");
});
let products = [];
$.get("/app/products/api/get_products.php", (data, status, xhr) => {
  $("#select-product").html("");
  products = data;
  productsReq
    .sort((productA, productB) =>
      productA.name < productB.name ? -1 : productA.name > productB.name ? 1 : 0
    )
    .forEach((productReq) => {
      let productSelected = data.filter(
        (product) => product.id == productReq.id
      )[0];
      if (productSelected != undefined) {
        $("#select-product").append(
          `<option value="${productSelected.id}">${productSelected.ref}</option>`
        );
        products.push(productSelected);
        $("#tableProducts tbody").append(`<tr>
      <td>${productSelected.ref}</td>
      <td>${productSelected.name}</td>
      <td class="text-right" id="quantity-product-${productSelected.id}">${productReq.quantity}</td>
      </tr>`);
      }
    });
  if (productsReq.length > 1) {
    $("#select-product").append(
      `<option value="total" selected>Consolidado</option>`
    );
    loadTotalCost();
  } else {
    loadCost(productsReq[0], false, true);
  }
});

$(".number").number(true, 2, ",", ".");

$("#select-product").change(function () {
  quitSimulation();
  if ($(this).val() == "total") {
    loadTotalCost();
  } else {
    loadCost(productsReq.filter((product) => product.id == $(this).val())[0]);
  }
});

function fillFields(data, flag = false, consolidado = true) {
  if (!flag) {
    $(".quantity-product").val(data.quantity);
  }

  /////// operaciones calculos finales a mostrar/////

  //// GASTOS GENERALES /////
  const gastosGenerales = data.generalExpenses;
  const pGastosGenerales = (gastosGenerales / data.salePrice) * 100;

  //////// COMISION VENTAS /////////////
  const pComisionVentas = data.salesCommission;
  const comisionVentas = (pComisionVentas * data.salePrice) / 100;

  ///// COSTOS /////////
  const cIndirectosFabricacion = data.indirectExpenses;
  const cManoObra = data.laborCost;
  const cMateriaPrima = data.rawMaterialExpenses;
  const costos = cIndirectosFabricacion + cManoObra + cMateriaPrima;
  ////// COSTOS PORCENTAJE /////////////
  const cpIndirectosFabricacion = (cIndirectosFabricacion / costos) * 100;
  const cpManoObra = (cManoObra / costos) * 100;
  const cpMateriaPrima = (cMateriaPrima / costos) * 100;
  const costosPorcentaje = (costos / data.salePrice) * 100;

  ////// TOTALS COSTOS  ////////////
  const totalCostos = gastosGenerales + costos;
  /* const gastosPorcentaje = gastos / totalCostos * 100; */

  const pTotalCostos = (totalCostos / data.salePrice) * 100;

  // total de costos
  /*   $('#totalCostosCOP').val(data.totalCost) */
  $("#totalCostosCOP").val(totalCostos);
  $("#totalCostosUSD").val(pTotalCostos.toFixed(2) + " %");
  /*   $('#totalCostosUSD').val((data.totalCost*100/data.salePrice).toFixed(2) + " %") */
  // precio de venta
  $("#precioVentaCOP").val(data.salePrice);
  $("#precioVentaUSD").val("100.00" + " %");
  //costos
  /*  $('#CostoCOP').val(data.cost) */
  $("#CostoCOP").val(costos);
  $("#CostoUSD").val(costosPorcentaje.toFixed(2) + " %");
  /*   $('#CostoUSD').val(((data.cost*100)/data.totalCost).toFixed(2)+ " %") */
  // materia prima
  /*  $('#materiaPrimaCOP').val(data.rawMaterialExpenses) */
  $("#materiaPrimaCOP").val(cMateriaPrima);
  /*   $('#materiaPrimaUSD').val((data.rawMaterialExpenses*100 /data.cost).toFixed(2)+ " %") */
  $("#materiaPrimaUSD").val(cpMateriaPrima.toFixed(2) + " %");
  //mano de obra
  /* $('#manoObraCOP').val(data.laborCost) */
  $("#manoObraCOP").val(cManoObra);
  /* $('#manoObraUSD').val((data.laborCost*100 / data.cost).toFixed(2) + " %") */
  $("#manoObraUSD").val(cpManoObra.toFixed(2) + " %");
  //costos indirectos
  /* $('#costosIndirectosCOP').val(data.indirectExpenses) */
  $("#costosIndirectosCOP").val(cIndirectosFabricacion);
  /*   $('#costosIndirectosUSD').val((data.indirectExpenses*100 / data.cost).toFixed(2) + " %") */
  $("#costosIndirectosUSD").val(cpIndirectosFabricacion.toFixed(2) + " %");
  // gastos
  $("#gastosCOP").val(gastosGenerales);
  /*   $('#gastosUSD').val((data.generalExpenses*100 / data.totalCost).toFixed(2) + " %") */
  $("#gastosUSD").val(pGastosGenerales.toFixed(2) + " %");

  // gastos generales
  /*   $('#gastosGeneralesCOP').val(gGenerales)
  if($('#gastosCOP').val()>0){ */
  /*  $('#gastosGeneralesUSD').val((data.generalExpenses*100 / data.generalExpenses).toFixed(2) + " %" ) */
  /*  $('#gastosGeneralesUSD').val((gpGenerales).toFixed(2) + " %" ) */
  /*   }
  else{
    $('#gastosGeneralesUSD').val( "0.00 %")
  } */
  // comision
  /*  $('#comisionCOP').val(data.salesCommission) */
  $("#comisionCOP").val(comisionVentas);
  if ($("#comisionCOP").val() > 0) {
    $("#comisionUSD").val(pComisionVentas.toFixed(2) + " %");
  } else {
    $("#comisionUSD").val("0.00 %");
  }
  // rentabilidad
  $("#rentabilidadCOP").val(data.profitability);
  /*   $('#rentabilidadUSD').val((data.profitability*100 / data.salePrice).toFixed(2) + " %") */
  if (consolidado) {
    $("#rentabilidadUSD").val(data.profitabilityMargin + " %");
  } else {
    $("#rentabilidadUSD").val(data.productProfitability + " %");
  }
}

// cargar informacion del producto cotizado
function loadCost(product, flag = false, cargaUnicoProducto = false) {
  $("#title-product").html(
    products.filter((productA) => productA.id == product.id)[0].name
  );
  $(".btn-product").addClass("btn btn-primary");
  $("#link-indicators").html("Ver indicadores");
  $("#link-simulation").html("Simular");
  $("#link-indicators").attr(
    "href",
    `indicators.php?id=${product.id}&quantity=${product.quantity}`
  );
  $(".quantity-product").attr("readonly", false);
  GetOpcionesEmpresa((opciones) => {
    if (opciones && opciones.tipoDistribucion == 0) {
      $.get(
        "api/cost_product_by_distribucion_directa.php",
        {
          id: product.id,
          quantity: product.quantity,
        },
        (data, status) => {
          data.salesCommission = parseFloat(data.salesCommission);
          if (!flag) {
            data.quantity = product.quantity;
          }
          fillFields(data, flag, false);
          if (cargaUnicoProducto) {
            loadChartWhenOneProduct(data);
          } else {
            loadChartIndividual(data);
          }
        }
      );
    } else {
      $.get(
        "api/cost_product_by_volumen_ventas.php",
        {
          id: product.id,
          quantity: product.quantity,
        },
        (data, status) => {
          data.salesCommission = parseFloat(data.salesCommission);
          if (!flag) {
            data.quantity = product.quantity;
          }
          fillFields(data, flag, false);
          if (cargaUnicoProducto) {
            loadChartWhenOneProduct(data);
          } else {
            loadChartIndividual(data);
          }
        }
      );
    }
  });
}
let consolidated;

consolidated = {
  quantity: 0,
  laborCost: 0,
  indirectExpenses: 0,
  rawMaterialExpenses: 0,
  cost: 0,
  generalExpenses: 0,
  totalCost: 0,
  salePrice: 0,
  profitability: 0,
  profitabilityMargin: 0,
  salesCommission: 0,
};
var flagChart = false;
function loadTotalCost() {
  $(".quantity-product").attr("readonly", true);
  $("#title-product").html("");
  $("#link-indicators").removeClass("btn btn-primary");
  $("#link-indicators").html("");
  $("#link-indicators").attr("href", `#`);
  GetOpcionesEmpresa((opciones) => {
    if (opciones && opciones.tipoDistribucion == 0) {
      $.get(
        "api/cost_product_by_distribucion_directa.php",
        {
          id: product.id,
          quantity: product.quantity,
        },
        (data, status) => {
          productsReq.forEach((product, indx) => {
            // cantidades
            consolidated.quantity += parseInt(product.quantity);
            // total de costos
            consolidated.totalCost += data.totalCost;
            // precio de venta
            consolidated.salePrice += data.salePrice;
            //costos
            consolidated.cost += data.cost;
            // materia prima
            consolidated.rawMaterialExpenses += data.rawMaterialExpenses;
            //mano de obra
            consolidated.laborCost += data.laborCost;
            //costos indirectos
            consolidated.indirectExpenses += data.indirectExpenses;
            // gastos
            consolidated.generalExpenses += data.generalExpenses;
            // comision
            /*    consolidated.salesCommission += data.salesCommission */
            consolidated.salesCommission = parseFloat(data.salesCommission);
            // rentabilidad
            consolidated.profitability += data.profitability;

            //porcenjate rentabilidad del producto
            consolidated.profitabilityMargin = parseFloat(
              data.profitabilityMargin
            );

            fillFields(consolidated);
            loadChart();
          });
        }
      );
    } else {
      $.get(
        "api/cost_product_by_volumen_ventas.php",
        {
          id: product.id,
          quantity: product.quantity,
        },
        (data, status) => {
          productsReq.forEach((product, indx) => {
            // cantidades
            consolidated.quantity += parseInt(product.quantity);
            // total de costos
            consolidated.totalCost += data.totalCost;
            // precio de venta
            consolidated.salePrice += data.salePrice;
            //costos
            consolidated.cost += data.cost;
            // materia prima
            consolidated.rawMaterialExpenses += data.rawMaterialExpenses;
            //mano de obra
            consolidated.laborCost += data.laborCost;
            //costos indirectos
            consolidated.indirectExpenses += data.indirectExpenses;
            // gastos
            consolidated.generalExpenses += data.generalExpenses;
            // comision
            /*    consolidated.salesCommission += data.salesCommission */
            consolidated.salesCommission = parseFloat(data.salesCommission);
            // rentabilidad
            consolidated.profitability += data.profitability;

            //porcenjate rentabilidad del producto
            consolidated.profitabilityMargin = parseFloat(
              data.profitabilityMargin
            );

            fillFields(consolidated);
            loadChart();
          });
        }
      );
    }
  });
}

let trm, average, desvEst, limInf;

$.get("https://www.datos.gov.co/resource/32sa-8pi3.json", (_trm, status) => {
  let sum = 0;
  let values = [];
  _trm.forEach(($trm) => {
    sum += parseFloat($trm.valor);
    values.push($trm.valor);
  });
  let average = sum / _trm.length;
  let desvEst = math.std(values);
  let limInf = average - desvEst * 1;
  $("#input-dollar-export").val(limInf);
  $("#input-dollar-export").number(true, 2, ".", ",");
  calculateCoverExport(limInf);
});
let colors = [
  "#4acccd",
  "#fcc468",
  "#f17e5d",
  "#6bd098",
  "#f8e286",
  "#a4bae3",
  "#7030a0",
  "#ffc000",
  "#ff0000",
  "#203864",
];

let color = colors[Math.floor(Math.random() * (colors.length - 0)) + 0];
let countChart = 1;

var charCost;
function loadChart() {
  countChart++;
  if (countChart == productsReq.length || productsReq.length == 1) {
    let ctx = document.getElementById("chartCost").getContext("2d");
    charCost = new Chart(ctx, {
      type: "bar",
      data: {
        labels: [
          "Materia Prima",
          "Costos Indirectos",
          "Mano de Obra",
          "Comisiones",
          "Gastos Generales",
        ],
        datasets: [
          {
            borderColor: "#fff",
            backgroundColor: color,
            borderWidth: 1,
            data: [
              $.number(consolidated.rawMaterialExpenses, 2, "."),
              $.number(consolidated.indirectExpenses, 2, "."),
              $.number(consolidated.laborCost, 2, "."),
              $.number(consolidated.salesCommission, 2, "."),
              $.number(consolidated.generalExpenses, 2, "."),
            ],
          },
        ],
      },
      options: {
        responsive: true,
        legend: {
          display: false,
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              let value =
                data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
              return " $ " + $.number(value, 2, ",", ".");
            },
          },
        },
        scales: {
          yAxes: [
            {
              display: true,
              ticks: {},
              gridLines: {
                offsetGridLines: true,
              },
            },
          ],
        },
        plugins: {
          datalabels: {
            align: "end",
            anchor: "center",
            clamp: true,
            backgroundColor: "#fff",
            borderColor: function (context) {
              return context.dataset.backgroundColor;
            },
            borderWidth: 2,
            borderRadius: 2,
            color: function (context) {
              return context.dataset.backgroundColor;
            },
            font: function (context) {
              var w = context.chart.width;
              return {
                size: w < 512 ? 12 : 14,
              };
            },
            formatter: function (value, context) {
              return `$ ${$.number(value, 2, ",", ".")}`;
            },
          },
        },
      },
    });
  } else if (countChart > productsReq.length) {
    charCost.data.datasets[0].data = [];
    charCost.data.datasets[0].data = [
      $.number(consolidated.rawMaterialExpenses, 2, "."),
      $.number(consolidated.indirectExpenses, 2, "."),
      $.number(consolidated.laborCost, 2, "."),
      $.number(consolidated.salesCommission, 2, "."),
      $.number(consolidated.generalExpenses, 2, "."),
    ];
    charCost.update();
  }
}

function loadChartIndividual(dataProduct) {
  charCost.data.datasets[0].data = [];
  charCost.data.datasets[0].backgroundColor =
    colors[Math.floor(Math.random() * (colors.length - 0)) + 0];
  charCost.data.datasets[0].data = [
    $.number(dataProduct.rawMaterialExpenses, 2, "."),
    $.number(dataProduct.indirectExpenses, 2, "."),
    $.number(dataProduct.laborCost, 2, "."),
    $.number(dataProduct.salesCommission, 2, "."),
    $.number(dataProduct.generalExpenses, 2, "."),
  ];
  charCost.update();
}

/// CARGA DE CHART CUANDO SOLO SE ESCOJE UN PRODUCTO ////
function loadChartWhenOneProduct(dataProduct) {
  let ctx = document.getElementById("chartCost").getContext("2d");
  charCost = new Chart(ctx, {
    type: "bar",
    data: {
      labels: [
        "Materia Prima",
        "Costos Indirectos",
        "Mano de Obra",
        "Comisiones",
        "Gastos Generales",
      ],
      datasets: [
        {
          borderColor: "#fff",
          backgroundColor: color,
          borderWidth: 1,
          data: [
            $.number(dataProduct.rawMaterialExpenses, 2, "."),
            $.number(dataProduct.indirectExpenses, 2, "."),
            $.number(dataProduct.laborCost, 2, "."),
            $.number(dataProduct.salesCommission, 2, "."),
            $.number(dataProduct.generalExpenses, 2, "."),
          ],
        },
      ],
    },
    options: {
      responsive: true,
      legend: {
        display: false,
      },
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            let value =
              data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
            return " $ " + $.number(value, 2, ",", ".");
          },
        },
      },
      scales: {
        yAxes: [
          {
            display: true,
            ticks: {},
            gridLines: {
              offsetGridLines: true,
            },
          },
        ],
      },
      plugins: {
        datalabels: {
          align: "end",
          anchor: "center",
          clamp: true,
          backgroundColor: "#fff",
          borderColor: function (context) {
            return context.dataset.backgroundColor;
          },
          borderWidth: 2,
          borderRadius: 2,
          color: function (context) {
            return context.dataset.backgroundColor;
          },
          font: function (context) {
            var w = context.chart.width;
            return {
              size: w < 512 ? 12 : 14,
            };
          },
          formatter: function (value, context) {
            return `$ ${$.number(value, 2, ",", ".")}`;
          },
        },
      },
    },
  });
}

function calculateCoverExport(limInf) {
  if (dollar > 0) {
    $("#input-cover-export").val(dollar - limInf);
    $("#input-cover-export").number(true, 2, ".", ",");
  } else {
    setTimeout(() => {
      calculateCoverExport(limInf);
    }, 1000);
  }
}

// evento de cambio en la cantidad
$(".quantity-product").keyup(function () {
  let value = parseInt($(this).val());
  changeQuantity(value);
});
$(".quantity-product").change(function () {
  let value = parseInt($(this).val());
  changeQuantity(value);
});
function changeQuantity(value) {
  if (value <= 0) {
    $(".quantity-product").val(1);
    value = 1;
  } else {
    $(".quantity-product").val(value);
  }
  productsReq.filter(
    (product) => product.id == $("#select-product").val()
  )[0].quantity = parseInt(value);
  let productSelected = productsReq.filter(
    (product) => product.id == $("#select-product").val()
  )[0];
  $(`#quantity-product-${productSelected.id}`).html(value);
  sessionStorage.setItem("products", JSON.stringify(productsReq));
  loadCost(
    productsReq.filter(
      (product) => product.id == $("#select-product").val()
    )[0],
    true
  );
}

function quitSimulation() {
  $("#materiaPrimaCOP").off();
  $("#manoObraCOP").off();
  $("#costosIndirectosCOP").off();
  /*  $('#gastosGeneralesCOP').off() */
  $("#comisionCOP").off();
  $("#rentabilidadCOP").off();

  $("#materiaPrimaCOP").attr("readonly", true);
  $("#manoObraCOP").attr("readonly", true);
  $("#costosIndirectosCOP").attr("readonly", true);
  /*   $('#gastosGeneralesCOP').attr('readonly', true) */
  $("#comisionCOP").attr("readonly", true);
  $("#rentabilidadCOP").attr("readonly", true);

  document.getElementById("materiaPrimaUSD").readOnly = true;
  document.getElementById("manoObraUSD").readOnly = true;
  document.getElementById("costosIndirectosUSD").readOnly = true;
  /*  document.getElementById('gastosGeneralesUSD').readOnly = true; */
  document.getElementById("comisionUSD").readOnly = true;
  document.getElementById("rentabilidadUSD").readOnly = true;
  document.getElementById("gastosUSD").readOnly = true;
}

const precioVentaCOP = document.getElementById("precioVentaCOP");
const costosCOP = document.getElementById("CostoCOP");
const costosUSD = document.getElementById("CostoUSD");
const manoObraUSD = document.getElementById("manoObraUSD");
manoObraUSD.firstEvent = true;
const materiaPrimaUSD = document.getElementById("materiaPrimaUSD");
materiaPrimaUSD.firstEvent = true;
const costosIndirectosUSD = document.getElementById("costosIndirectosUSD");
/* const gastosGeneralesUSD = document.getElementById('gastosGeneralesUSD'); */
const comisionUSD = document.getElementById("comisionUSD");
const comisionCOP = document.getElementById("comisionCOP");
const rentabilidadUSD = document.getElementById("rentabilidadUSD");
const rentabilidadCOP = document.getElementById("rentabilidadCOP");
const gastosUSD = document.getElementById("gastosUSD");
const gastosCOP = document.getElementById("gastosCOP");
const totalCostosCOP = document.getElementById("totalCostosCOP");
const totalCostosUSD = document.getElementById("totalCostosUSD");

function simulationCost() {
  $(".number").number(true, 2, ",", ".");

  //Habilitar Porcentajes

  manoObraUSD.readOnly = false;
  materiaPrimaUSD.readOnly = false;
  costosIndirectosUSD.readOnly = false;
  /*   gastosGeneralesUSD.readOnly = false; */
  gastosUSD.readOnly = false;
  comisionUSD.readOnly = false;
  rentabilidadUSD.readOnly = false;
  const costoCOP = document.getElementById("CostoCOP");
  const precioVentaCOP = document.getElementById("precioVentaCOP");

  materiaPrimaUSD.oninput = startCostSimulation.bind(
    null,
    materiaPrimaUSD.value,
    manoObraUSD.value,
    costosIndirectosUSD.value,
    costoCOP
  );
  manoObraUSD.oninput = startCostSimulation.bind(
    null,
    materiaPrimaUSD.value,
    manoObraUSD.value,
    costosIndirectosUSD.value,
    costoCOP
  );
  costosIndirectosUSD.oninput = startCostSimulation.bind(
    null,
    materiaPrimaUSD.value,
    manoObraUSD.value,
    costosIndirectosUSD.value,
    costoCOP
  );
  gastosUSD.oninput = calculateNewValuesOnChange.bind(
    null,
    gastosUSD.value,
    rentabilidadUSD.value,
    comisionUSD.value
  );
  /*   gastosGeneralesUSD.oninput = startCostSimulation2.bind(null, gastosGeneralesUSD.value, $('#gastosCOP').val()); */
  /*  comisionUSD.oninput = startCostSimulation2.bind(null, comisionUSD.value, $('#gastosCOP').val()); */
  comisionUSD.oninput = calculatePrecioVenta;
  /* rentabilidadUSD.oninput = cambioPorcentajeRentabilidad.bind(null, precioVentaCOP.value); */
  rentabilidadUSD.oninput = calculatePrecioVenta;

  materiaPrimaUSD.onchange = formatOnChange;
  manoObraUSD.onchange = formatOnChange;
  costosIndirectosUSD.onchange = formatOnChange;
  gastosUSD.onchange = formatOnChange;
  comisionUSD.onchange = formatOnChange;
  rentabilidadUSD.onchange = formatOnChange;

  manoObraUSDValue = manoObraUSD.value;
}

document.getElementById("link-simulation").onclick = (e) => {
  e.preventDefault();
  simulationCost();
}

function formatOnChange(ev) {
  ev.target.value = parseFloat(ev.target.value).toFixed(2) + " %";
}

// Calcula precio total venta basado en el total costos, rentabilidad y comision venta.
function calculatePrecioVenta() {
  const rentabilidadUSDValue = parseFloat(rentabilidadUSD.value);
  const comisionUSDValue = parseFloat(comisionUSD.value);
  const totalCostosCOPValue = parseFloat(
    totalCostosCOP.value.replaceAll(".", "").replace(",", ".")
  );

  const precioVentaCOPValue =
    totalCostosCOPValue /
    (1 - rentabilidadUSDValue / 100 - comisionUSDValue / 100);

  precioVentaCOP.value = formatCurrency(precioVentaCOPValue);
  totalCostosUSD.value =
    ((totalCostosCOPValue / precioVentaCOPValue) * 100).toFixed(2) + " %";

  calculateCOPS();

  charCost.data.datasets[0].data = [
    $.number(parseFloat($("#materiaPrimaCOP").val()), 2, "."),
    $.number(parseFloat($("#costosIndirectosCOP").val()), 2, "."),
    $.number(parseFloat($("#manoObraCOP").val()), 2, "."),
    $.number(parseFloat($("#comisionCOP").val()), 2, "."),
    $.number(parseFloat($("#gastosCOP").val()), 2, "."),
  ];
  charCost.update();
}

function calculateCOPS() {
  const rentabilidadUSDValue = parseFloat(rentabilidadUSD.value);
  const comisionUSDValue = parseFloat(comisionUSD.value);

  const precioVentaCOPValue = parseFloat(
    precioVentaCOP.value.replaceAll(".", "").replace(",", ".")
  );

  rentabilidadCOP.value = formatCurrency(
    (precioVentaCOPValue * rentabilidadUSDValue) / 100
  );
  comisionCOP.value = formatCurrency(
    (precioVentaCOPValue * comisionUSDValue) / 100
  );

  calculateCostosGastosCOP();
}

function calculateCostosGastosCOP() {
  const costosCOPValue = parseFloat(
    costosCOP.value.replaceAll(".", "").replace(",", ".")
  );
  const gastosCOPValue = parseFloat(
    gastosCOP.value.replaceAll(".", "").replace(",", ".")
  );

  const precioVentaCOPValue = parseFloat(
    precioVentaCOP.value.replaceAll(".", "").replace(",", ".")
  );

  costosUSD.value =
    ((costosCOPValue / precioVentaCOPValue) * 100).toFixed(2) + " %";
  gastosUSD.value =
    ((gastosCOPValue / precioVentaCOPValue) * 100).toFixed(2) + " %";
}

function calculateNewValuesOnChange(
  oldGastosUSDValue,
  oldRentabilidadUSDValue,
  oldComisionUSDValue,
  ev
) {
  const newGastos = ev.target;
  oldGastosUSDValue = parseFloat(oldGastosUSDValue);
  const newGastosUSDValue = parseFloat(newGastos.value);
  const costosUSDValue = parseFloat(costosUSD.value);
  oldComisionUSDValue = parseFloat(oldComisionUSDValue);
  oldRentabilidadUSDValue = parseFloat(oldRentabilidadUSDValue);

  const precioVentaCOPValue = parseFloat(
    precioVentaCOP.value.replaceAll(".", "").replace(",", ".")
  );

  totalCostosUSD.value = (costosUSDValue + newGastosUSDValue).toFixed(2) + " %";
  const totalCostosUSDValue = parseFloat(totalCostosUSD.value);

  const diffNewOldGastosUSD = newGastosUSDValue - oldGastosUSDValue;

  comisionUSD.value =
    (oldComisionUSDValue - diffNewOldGastosUSD / 2).toFixed(2) + " %";
  rentabilidadUSD.value =
    (oldRentabilidadUSDValue - diffNewOldGastosUSD / 2).toFixed(2) + " %";

  gastosCOP.value = formatCurrency(
    (precioVentaCOPValue * newGastosUSDValue) / 100
  );
  totalCostosCOP.value = formatCurrency(
    (precioVentaCOPValue * totalCostosUSDValue) / 100
  );

  const comisionUSDValue = parseFloat(comisionUSD.value);
  const rentabilidadUSDValue = parseFloat(rentabilidadUSD.value);

  comisionCOP.value = formatCurrency(
    (precioVentaCOPValue * comisionUSDValue) / 100
  );
  rentabilidadCOP.value = formatCurrency(
    (precioVentaCOPValue * rentabilidadUSDValue) / 100
  );

  charCost.data.datasets[0].data = [
    $.number(parseFloat($("#materiaPrimaCOP").val()), 2, "."),
    $.number(parseFloat($("#costosIndirectosCOP").val()), 2, "."),
    $.number(parseFloat($("#manoObraCOP").val()), 2, "."),
    $.number(parseFloat($("#comisionCOP").val()), 2, "."),
    $.number(parseFloat($("#gastosCOP").val()), 2, "."),
  ];
  charCost.update();
}

function sumCostPercentage(inputUSDVal, inputCOPVal, ev) {
  const inputTarget = ev.target;
  const costoCOPInput = document.getElementById("CostoCOP");
  const costoCOPval = parseFloat(
    costoCOPInput.value.replace(".", "").replace(",", ".")
  );
  const gastosCOPInput = document.getElementById("gastosCOP");
  const gastosCOPval = parseFloat(
    gastosCOPInput.value.replace(".", "").replace(",", ".")
  );
  let COPInput;

  switch (inputTarget.id) {
    case "materiaPrimaUSD":
      COPInput = document.getElementById("materiaPrimaCOP");

      const pastCOPInputValue = COPInput.value;
      innerFn(materiaPrimaUSD, costoCOPval);
      break;
    case "manoObraUSD":
      COPInput = document.getElementById("manoObraCOP");
      innerFn(manoObraUSD, costoCOPval);
      break;
    case "costosIndirectosUSD":
      COPInput = document.getElementById("costosIndirectosCOP");
      innerFn(costosIndirectosUSD, costoCOPval);
      break;
    case "gastosGeneralesUSD":
      COPInput = document.getElementById("gastosGeneralesCOP");
      innerFn(gastosGeneralesUSD, gastosCOPval);
      break;
    case "comisionUSD":
      COPInput = document.getElementById("comisionCOP");
      innerFn(comisionUSD, gastosCOPval);
      break;
    default:
      break;
  }

  sumCost2(inputTarget);

  function innerFn(USDInput, COPTotalInputVal) {
    if (ev.type === "keyup" && inputTarget.value === inputUSDVal) {
      COPInput.value = formatCurrency(parseFloat(inputCOPVal));
    } else {
      const finalValueFormat = formatCurrency(
        (COPTotalInputVal * parseFloat(USDInput.value)) / 100
      );
      COPInput.value = finalValueFormat;
    }
  }
}

function formatCurrency(resultadoFloat) {
  return $.number(resultadoFloat, 2, ",", ".");
}

function updateCostosFields(pastInputValue) {
  const costoCOPInput = document.getElementById("CostoCOP");
  const materiaPrimaCOP = document.getElementById("materiaPrimaCOP");
  pastInputValue = parseFloat(
    pastInputValue.replace(".", "").replace(",", ".")
  );
  const materiaPrimaCOPValue = parseFloat(
    materiaPrimaCOP.value.replace(".", "").replace(",", ".")
  );
  const diferenciaValores = pastInputValue - materiaPrimaCOPValue;
}

function sumCost() {
  $("#CostoCOP").val(
    parseFloat($("#materiaPrimaCOP").val()) +
      parseFloat($("#manoObraCOP").val()) +
      parseFloat($("#costosIndirectosCOP").val())
  );
  /*  $('#gastosCOP').val($('#gastosGeneralesCOP').val()) */
  $("#gastosCOP").val(
    parseFloat($("#gastosGeneralesCOP").val()) +
      parseFloat($("#comisionCOP").val())
  );
  $("#totalCostosCOP").val(
    parseFloat($("#CostoCOP").val()) +
      parseFloat($("#gastosGeneralesCOP").val())
  );
  calculatesalePrice();
  calculateUSD();
}

function calculatesalePrice() {
  $("#precioVentaCOP").val(
    parseFloat($("#totalCostosCOP").val()) +
      parseFloat($("#comisionCOP").val()) +
      parseFloat($("#rentabilidadCOP").val())
  );
  calculateUSD();
  charCost.data.datasets[0].data = [
    $.number(parseFloat($("#materiaPrimaCOP").val()), 2, "."),
    $.number(parseFloat($("#costosIndirectosCOP").val()), 2, "."),
    $.number(parseFloat($("#manoObraCOP").val()), 2, "."),
    $.number(parseFloat($("#comisionCOP").val()), 2, "."),
    $.number(parseFloat($("#gastosGeneralesCOP").val()), 2, "."),
  ];
  charCost.update();
}

function calculateUSD() {
  // total de costos
  $("#totalCostosUSD").val(
    (
      (parseFloat($("#totalCostosCOP").val()) * 100) /
      parseFloat($("#precioVentaCOP").val())
    ).toFixed(2) + " %"
  );
  // precio de venta
  $("#precioVentaUSD").val("100.00 %");
  //costos
  $("#CostoUSD").val(
    (
      (parseFloat($("#CostoCOP").val()) * 100) /
      parseFloat($("#totalCostosCOP").val())
    ).toFixed(2) + " %"
  );
  // materia prima
  $("#materiaPrimaUSD").val(
    (
      (parseFloat($("#materiaPrimaCOP").val()) * 100) /
      parseFloat($("#CostoCOP").val())
    ).toFixed(2) + " %"
  );
  //mano de obra
  $("#manoObraUSD").val(
    (
      (parseFloat($("#manoObraCOP").val()) * 100) /
      parseFloat($("#CostoCOP").val())
    ).toFixed(2) + " %"
  );
  //costos indirectos
  $("#costosIndirectosUSD").val(
    (
      (parseFloat($("#costosIndirectosCOP").val()) * 100) /
      parseFloat($("#CostoCOP").val())
    ).toFixed(2) + " %"
  );
  // gastos
  $("#gastosUSD").val(
    (
      (parseFloat($("#gastosCOP").val()) * 100) /
      parseFloat($("#totalCostosCOP").val())
    ).toFixed(2) + " %"
  );
  // gastos generales
  $("#gastosGeneralesUSD").val(
    (
      (parseFloat($("#gastosGeneralesCOP").val()) * 100) /
      parseFloat($("#gastosCOP").val())
    ).toFixed(2) + " %"
  );
  // comision
  $("#comisionUSD").val(
    (
      (parseFloat($("#comisionCOP").val()) * 100) /
      parseFloat($("#gastosCOP").val())
    ).toFixed(2) + " %"
  );
  // rentabilidad
  $("#rentabilidadUSD").val(
    (
      (parseFloat($("#rentabilidadCOP").val()) * 100) /
      parseFloat($("#precioVentaCOP").val())
    ).toFixed(2) + " %"
  );
}

function sumCost2(newUSDInputNoCalc) {
  $("#CostoCOP").val(
    parseFloat($("#materiaPrimaCOP").val()) +
      parseFloat($("#manoObraCOP").val()) +
      parseFloat($("#costosIndirectosCOP").val())
  );
  $("#gastosCOP").val($("#gastosGeneralesCOP").val());
  $("#totalCostosCOP").val(
    parseFloat($("#CostoCOP").val()) +
      parseFloat($("#gastosGeneralesCOP").val())
  );
  /* calculatesalePrice(); */
  /* calculateUSD(); */
  /*   calculateUSDPercentage(newUSDInputNoCalc); */
}

const totalCost = document.getElementById("CostoCOP");

function startCostSimulation2(inputValue, gastosValue, ev) {
  inputValue = parseFloat(inputValue);
  gastosValue = parseFloat(gastosValue);
  const inputTarget = ev.target;
  const inputTargetValue = parseFloat(inputTarget.value);
  const COPTarget = document.getElementById(
    `${inputTarget.id.replace("USD", "COP")}`
  );
  const newCOPTargetValue = (inputTargetValue * gastosValue) / 100;
  COPTarget.value = formatCurrency(newCOPTargetValue);

  const diffCostAndtargetCOP = gastosValue - newCOPTargetValue;

  const filterInputs = Array.from(
    document.querySelectorAll('input[id$="COP"]:not([readonly])')
  ).filter(
    (input) => input.id !== COPTarget.id && input.id !== "rentabilidadCOP"
  );

  const inputToChange = filterInputs[filterInputs.length - 1];
  inputToChange.value = formatCurrency(diffCostAndtargetCOP);
  const inputUSDToChange = document.getElementById(
    inputToChange.id.replace("COP", "USD")
  );
  inputUSDToChange.value =
    ((diffCostAndtargetCOP / gastosValue) * 100).toFixed(2) + " $";

  charCost.data.datasets[0].data = [
    $.number(parseFloat($("#materiaPrimaCOP").val()), 2, "."),
    $.number(parseFloat($("#costosIndirectosCOP").val()), 2, "."),
    $.number(parseFloat($("#manoObraCOP").val()), 2, "."),
    $.number(parseFloat($("#comisionCOP").val()), 2, "."),
    $.number(parseFloat($("#gastosGeneralesCOP").val()), 2, "."),
  ];
  charCost.update();
}

function startCostSimulation(
  materiaPrimaUSDValue,
  manoObraUSDValue,
  costosIndirectosUSDValue,
  inputOption,
  ev
) {
  manoObraUSDValue = parseFloat(manoObraUSDValue);
  costosIndirectosUSDValue = parseFloat(costosIndirectosUSDValue);
  materiaPrimaUSDValue = parseFloat(materiaPrimaUSDValue);

  const costValue = parseFloat(
    inputOption.value.replace(".", "").replace(",", ".")
  );
  const inputTarget = ev.target;
  const inputTargetValue = parseFloat(inputTarget.value);
  const COPTarget = document.getElementById(
    `${inputTarget.id.replace("USD", "COP")}`
  );
  const newCOPTargetValue = (inputTargetValue * costValue) / 100;
  COPTarget.value = formatCurrency(newCOPTargetValue);

  const diffCostAndtargetCOP = costValue - newCOPTargetValue;

  if (inputTarget.id === "materiaPrimaUSD") {
    /*     if (materiaPrimaUSDTempValue === '' || materiaPrimaUSDTempValue === inputTarget.value) {
      materiaPrimaUSDTempValue = inputTarget.value;
      charCost.data.datasets[0].data = [
        $.number(parseFloat($('#materiaPrimaCOP').val()), 2, '.'),
        $.number(parseFloat($('#costosIndirectosCOP').val()), 2, '.'),
        $.number(parseFloat($('#manoObraCOP').val()), 2, '.'),
        $.number(parseFloat($('#comisionCOP').val()), 2, '.'),
        $.number(parseFloat($('#gastosGeneralesCOP').val()), 2, '.')
      ]
      charCost.update();
      return;
    } */
    const manoObraPart = (diffCostAndtargetCOP * manoObraUSDValue) / 100;
    const costosIndirectosPart =
      (diffCostAndtargetCOP * costosIndirectosUSDValue) / 100;

    const partToDistribute =
      diffCostAndtargetCOP - (manoObraPart + costosIndirectosPart);

    const manoObraCOP = document.getElementById("manoObraCOP");
    manoObraCOP.value = formatCurrency(manoObraPart + partToDistribute / 2);
    const costosIndirectosCOP = document.getElementById("costosIndirectosCOP");
    costosIndirectosCOP.value = formatCurrency(
      costosIndirectosPart + partToDistribute / 2
    );

    const manoObraCOPValue = parseFloat(
      manoObraCOP.value.replace(".", "").replace(",", ".")
    );
    const costosIndirectosCOPValue = parseFloat(
      costosIndirectosCOP.value.replace(".", "").replace(",", ".")
    );

    manoObraUSD.value =
      ((manoObraCOPValue / costValue) * 100).toFixed(2) + " %";
    costosIndirectosUSD.value =
      ((costosIndirectosCOPValue / costValue) * 100).toFixed(2) + " %";
  } else if (inputTarget.id === "manoObraUSD") {
    const materiaPrimaPart =
      (diffCostAndtargetCOP * materiaPrimaUSDValue) / 100;
    const costosIndirectosPart =
      (diffCostAndtargetCOP * costosIndirectosUSDValue) / 100;

    const partToDistribute =
      diffCostAndtargetCOP - (materiaPrimaPart + costosIndirectosPart);

    const materiaPrimaCOP = document.getElementById("materiaPrimaCOP");
    materiaPrimaCOP.value = formatCurrency(
      materiaPrimaPart + partToDistribute / 2
    );
    const costosIndirectosCOP = document.getElementById("costosIndirectosCOP");
    costosIndirectosCOP.value = formatCurrency(
      costosIndirectosPart + partToDistribute / 2
    );

    const materiaPrimaCOPValue = parseFloat(
      materiaPrimaCOP.value.replace(".", "").replace(",", ".")
    );
    const costosIndirectosCOPValue = parseFloat(
      costosIndirectosCOP.value.replace(".", "").replace(",", ".")
    );

    materiaPrimaUSD.value =
      ((materiaPrimaCOPValue / costValue) * 100).toFixed(2) + " %";
    costosIndirectosUSD.value =
      ((costosIndirectosCOPValue / costValue) * 100).toFixed(2) + " %";
  } else {
    const materiaPrimaPart =
      (diffCostAndtargetCOP * materiaPrimaUSDValue) / 100;
    const manoObraPart = (diffCostAndtargetCOP * manoObraUSDValue) / 100;

    const partToDistribute =
      diffCostAndtargetCOP - (materiaPrimaPart + manoObraPart);

    const materiaPrimaCOP = document.getElementById("materiaPrimaCOP");
    materiaPrimaCOP.value = formatCurrency(
      materiaPrimaPart + partToDistribute / 2
    );
    const manoObraCOP = document.getElementById("manoObraCOP");
    manoObraCOP.value = formatCurrency(manoObraPart + partToDistribute / 2);

    const materiaPrimaCOPValue = parseFloat(
      materiaPrimaCOP.value.replace(".", "").replace(",", ".")
    );
    const manoObraCOPValue = parseFloat(
      manoObraCOP.value.replace(".", "").replace(",", ".")
    );

    materiaPrimaUSD.value =
      ((materiaPrimaCOPValue / costValue) * 100).toFixed(2) + " %";
    manoObraUSD.value =
      ((manoObraCOPValue / costValue) * 100).toFixed(2) + " %";
  }

  charCost.data.datasets[0].data = [
    $.number(parseFloat($("#materiaPrimaCOP").val()), 2, "."),
    $.number(parseFloat($("#costosIndirectosCOP").val()), 2, "."),
    $.number(parseFloat($("#manoObraCOP").val()), 2, "."),
    $.number(parseFloat($("#comisionCOP").val()), 2, "."),
    $.number(parseFloat($("#gastosGeneralesCOP").val()), 2, "."),
  ];
  charCost.update();
}

function cambioPorcentajeRentabilidad(inputPrecioVentaCOPValue, ev) {
  inputPrecioVentaCOPValue = inputPrecioVentaCOPValue
    .replace(".", "")
    .replace(",", ".");
  const rentabilidadUSD = ev.target;
  const rentabilidadUSDValue = parseFloat(rentabilidadUSD.value);
  const totalCostosCOP = document.getElementById("totalCostosCOP");

  /*   const totalCostosCOPValue = parseFloat(totalCostosCOP.value.replace('.', '').replace(',', '.')); */
  const totalCostosUSD = document.getElementById("totalCostosUSD");
  const rentabilidadCOP = document.getElementById("rentabilidadCOP");

  const newRentabilidadCOPValue =
    (rentabilidadUSDValue * inputPrecioVentaCOPValue) / 100;
  const newCostosUSDValue = 100 - rentabilidadUSDValue;
  const newCostosCOPValue =
    (inputPrecioVentaCOPValue * newCostosUSDValue) / 100;

  rentabilidadCOP.value = formatCurrency(newRentabilidadCOPValue);
  totalCostosUSD.value = newCostosUSDValue.toFixed(2) + " %";
  totalCostosCOP.value = formatCurrency(newCostosCOPValue);
}

export { consolidated, productsReq, products, limInf };
