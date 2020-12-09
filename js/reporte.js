var productsReq = JSON.parse(sessionStorage.getItem('products'))

var dollar = 0
$('#dollar').load('api/page_dollar.php #cc-ratebox', (data, status, xhr) => {
  strDollar = $('#dollar #cc-ratebox').text()
  strDollar = strDollar.substring(10, strDollar.length)
  strDollar = strDollar.replace('.', '', 'gi')
  strDollar = strDollar.replace(',', '.', 'gi')
  dollar = parseFloat(strDollar)
  $('#input-dollar').val(strDollar.replace('.', ',', 'gi'))
  $('#input-dollar').number(true, 2, ',', '.')
})
var products = []
$.get('/app/products/api/get_products.php', (data, status, xhr) => {
  $('#select-product').html('')
  products = data
  productsReq.forEach((productReq) => {
    let productSelected = data.filter(product => product.id == productReq.id)[0]
    if (productSelected != undefined) {
      $('#select-product').append(`<option value="${productSelected.id}">${productSelected.ref}</option>`)
      products.push(productSelected)
      $('#tableProducts tbody').append(`<tr>
      <td>${productSelected.ref}</td>
      <td>${productSelected.name}</td>
      <td class="text-right" id="quantity-product-${productSelected.id}">${productReq.quantity}</td>
      </tr>`)
    }
  })
  if (productsReq.length > 1) {
    $('#select-product').append(`<option value="total" selected>Consolidado</option>`)
    loadTotalCost()
  }
  else {
    loadCost(productsReq[0], false, true);
  }
})

// formateo de entradas
$('.number').number(true, 2, ',', '.')

$('#select-product').change(function () {
  quitSimulation()
/*   console.log('select this', this); */
  if ($(this).val() == 'total') {
    loadTotalCost()
  } else {
    loadCost(productsReq.filter(product => product.id == $(this).val())[0])
  }
})

function fillFields(data, flag = false, consolidado = true) {
  if (!flag) {
    $('.quantity-product').val(data.quantity)
  }

  /////// operaciones calculos finales a mostrar/////
  //// GASTOS /////
  const gComisionVentas = data.salesCommission;
  const gGenerales = data.generalExpenses;
  const gastos = gComisionVentas + gGenerales;
  ////// GASTOS PORCENTAJES //////////
  const gpComisionVentas = gComisionVentas * 100 / gastos;
  const gpGenerales = gGenerales / gastos * 100;
 

  ///// COSTOS /////////
  const cIndirectosFabricacion = data.indirectExpenses;
  const cManoObra = data.laborCost;
  const cMateriaPrima = data.rawMaterialExpenses;
  const costos = cIndirectosFabricacion + cManoObra + cMateriaPrima;
  ////// COSTOS PORCENTAJE /////////////
  const cpIndirectosFabricacion = cIndirectosFabricacion / costos * 100;
  const cpManoObra = cManoObra / costos * 100;
  const cpMateriaPrima = cMateriaPrima / costos * 100;

  const totalCostos = gastos + costos;
  const gastosPorcentaje = gastos / totalCostos * 100;
  const costosPorcentaje = costos / totalCostos * 100;
  const pTotalCostos = totalCostos / data.salePrice * 100;


  // total de costos
/*   $('#totalCostosCOP').val(data.totalCost) */
$('#totalCostosCOP').val(totalCostos)
$('#totalCostosUSD').val((pTotalCostos).toFixed(2) + " %")
/*   $('#totalCostosUSD').val((data.totalCost*100/data.salePrice).toFixed(2) + " %") */
  // precio de venta
  $('#precioVentaCOP').val(data.salePrice)
  $('#precioVentaUSD').val("100.00" + " %")
  //costos
 /*  $('#CostoCOP').val(data.cost) */
 $('#CostoCOP').val(costos)
 $('#CostoUSD').val((costosPorcentaje).toFixed(2)+ " %")
/*   $('#CostoUSD').val(((data.cost*100)/data.totalCost).toFixed(2)+ " %") */
  // materia prima
 /*  $('#materiaPrimaCOP').val(data.rawMaterialExpenses) */
  $('#materiaPrimaCOP').val(cMateriaPrima)
/*   $('#materiaPrimaUSD').val((data.rawMaterialExpenses*100 /data.cost).toFixed(2)+ " %") */
$('#materiaPrimaUSD').val((cpMateriaPrima).toFixed(2)+ " %")
  //mano de obra
  /* $('#manoObraCOP').val(data.laborCost) */
  $('#manoObraCOP').val(cManoObra)
  /* $('#manoObraUSD').val((data.laborCost*100 / data.cost).toFixed(2) + " %") */
  $('#manoObraUSD').val((cpManoObra).toFixed(2) + " %")
  //costos indirectos
  /* $('#costosIndirectosCOP').val(data.indirectExpenses) */
  $('#costosIndirectosCOP').val(cIndirectosFabricacion)
/*   $('#costosIndirectosUSD').val((data.indirectExpenses*100 / data.cost).toFixed(2) + " %") */
$('#costosIndirectosUSD').val((cpIndirectosFabricacion).toFixed(2) + " %")
  // gastos
  $('#gastosCOP').val(gastos)
/*   $('#gastosUSD').val((data.generalExpenses*100 / data.totalCost).toFixed(2) + " %") */
 $('#gastosUSD').val((gastosPorcentaje).toFixed(2) + " %")

  // gastos generales
  $('#gastosGeneralesCOP').val(gGenerales)
  if($('#gastosCOP').val()>0){
 /*  $('#gastosGeneralesUSD').val((data.generalExpenses*100 / data.generalExpenses).toFixed(2) + " %" ) */
 $('#gastosGeneralesUSD').val((gpGenerales).toFixed(2) + " %" )
  }
  else{
    $('#gastosGeneralesUSD').val( "0.00 %")
  }
  // comision 
 /*  $('#comisionCOP').val(data.salesCommission) */
  $('#comisionCOP').val(gComisionVentas)
  if($('#comisionCOP').val()>0){
 /*  $('#comisionUSD').val((data.salesCommission / limInf).toFixed(2) + " %") */
 $('#comisionUSD').val((gpComisionVentas).toFixed(2) + " %")
  }
  else{
    $('#comisionUSD').val( "0.00 %")
  }
  // rentabilidad
  $('#rentabilidadCOP').val(data.profitability)
/*   $('#rentabilidadUSD').val((data.profitability*100 / data.salePrice).toFixed(2) + " %") */
  if (consolidado) {
    $('#rentabilidadUSD').val((data.profitabilityMargin) + " %") 
  }else{
    $('#rentabilidadUSD').val((data.productProfitability) + " %") 
  }

}

// cargar informacion del producto cotizado
function loadCost(product, flag = false, cargaUnicoProducto = false) {
  $('#title-product').html(products.filter(productA => productA.id == product.id)[0].name)
  $('.btn-product').addClass('btn btn-primary')
  $('#link-indicators').html('Ver indicadores')
  $('#link-simulation').html('Simular')
  $('#link-indicators').attr('href', `indicators.php?id=${product.id}&quantity=${product.quantity}`)
  $('.quantity-product').attr('readonly', false)
  $.get('api/cost_product.php', {
    id: product.id,
    quantity: product.quantity
  },
    (data, status) => {
      if (!flag) {
        data.quantity = product.quantity
      }
      fillFields(data, flag, false)
      if (cargaUnicoProducto) {
        loadChartWhenOneProduct(data);
      }else{
        loadChartIndividual(data)
      }
      
    })
}
var consolidated
var flagChart = false
function loadTotalCost() {
  $('.quantity-product').attr('readonly', true)
  $('#title-product').html('')
  $('#link-indicators').removeClass('btn btn-primary')
  $('#link-indicators').html('')
  $('#link-indicators').attr('href', `#`)
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
    salesCommission: 0
  }
  productsReq.forEach((product, indx) => {
    $.get('api/cost_product.php', {
      id: product.id,
      quantity: product.quantity,
      consolidated: 1,
    },
      (data, status) => {
        // cantidades
        consolidated.quantity += parseInt(product.quantity)
        // total de costos
        consolidated.totalCost += data.totalCost
        // precio de venta
        consolidated.salePrice += data.salePrice
        //costos
        consolidated.cost += data.cost
        // materia prima
        consolidated.rawMaterialExpenses += data.rawMaterialExpenses
        //mano de obra
        consolidated.laborCost += data.laborCost
        //costos indirectos
        consolidated.indirectExpenses += data.indirectExpenses
        // gastos
        consolidated.generalExpenses += data.generalExpenses
        // comision 
        consolidated.salesCommission += data.salesCommission
        // rentabilidad
        consolidated.profitability += data.profitability

        //porcenjate rentabilidad del producto
        consolidated.profitabilityMargin = parseFloat(data.profitabilityMargin);

        fillFields(consolidated)
        loadChart()
      })
  })

}

var trm, average, desvEst, limInf

$.get('https://www.datos.gov.co/resource/32sa-8pi3.json', (_trm, status) => {
  trm = _trm
  let sum = 0
  values = []
  _trm.forEach(($trm) => {
    sum += parseFloat($trm.valor)
    values.push($trm.valor)
  })
  average = sum / _trm.length
  desvEst = math.std(values)
  limInf = average - (desvEst * 1)
  $('#input-dollar-export').val(limInf)
  $('#input-dollar-export').number(true, 2, '.', ',')
  calculateCoverExport(limInf)

})
let colors = [
  '#4acccd', '#fcc468', '#f17e5d', '#6bd098', '#f8e286', '#a4bae3', '#7030a0', '#ffc000', '#ff0000', '#203864'
]

let color = colors[Math.floor(Math.random() * (colors.length - 0)) + 0]
let countChart = 1
// inicializacion del grafico
var charCost
function loadChart() {
  countChart++
  if (countChart == productsReq.length || productsReq.length == 1) {
    let ctx = document.getElementById('chartCost').getContext('2d')
    charCost = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Materia Prima', 'Costos Indirectos', 'Mano de Obra', 'Comisiones', 'Gastos Generales'],
        datasets: [{
          borderColor: '#fff',
          backgroundColor: color,
          borderWidth: 1,
          data: [$.number(consolidated.rawMaterialExpenses, 2, '.'),
          $.number(consolidated.indirectExpenses, 2, '.'),
          $.number(consolidated.laborCost, 2, '.'),
          $.number(consolidated.salesCommission, 2, '.'),
          $.number(consolidated.generalExpenses, 2, '.')]
        }]
      },
      options: {
        responsive: true,
        legend: {
          display: false
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              let value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]
              return ' $ ' + $.number(value, 2, ',', '.')
            }
          }
        },
        scales: {
          yAxes: [{
            display: true,
            ticks: {

            },
            gridLines: {
              offsetGridLines: true
            }
          }]
        },
        plugins: {
          datalabels: {
            align: 'end',
            anchor: 'center',
            clamp: true,
            backgroundColor: '#fff',
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
                size: w < 512 ? 12 : 14
              };
            },
            formatter: function (value, context) {
              return `$ ${$.number(value, 2, ',', '.')}`
            }
          }
        },
      }
    })
  } else if (countChart > productsReq.length) {
    charCost.data.datasets[0].data = []
    charCost.data.datasets[0].data = [
      $.number(consolidated.rawMaterialExpenses, 2, '.'),
      $.number(consolidated.indirectExpenses, 2, '.'),
      $.number(consolidated.laborCost, 2, '.'),
      $.number(consolidated.salesCommission, 2, '.'),
      $.number(consolidated.generalExpenses, 2, '.')
    ]
    charCost.update()
  }
}
/* console.log(Chart.defaults.global.layout) */
function loadChartIndividual(dataProduct) {
  charCost.data.datasets[0].data = []
  charCost.data.datasets[0].backgroundColor = colors[Math.floor(Math.random() * (colors.length - 0)) + 0]
  charCost.data.datasets[0].data = [
    $.number(dataProduct.rawMaterialExpenses, 2, '.'),
    $.number(dataProduct.indirectExpenses, 2, '.'),
    $.number(dataProduct.laborCost, 2, '.'),
    $.number(dataProduct.salesCommission, 2, '.'),
    $.number(dataProduct.generalExpenses, 2, '.')
  ]
  charCost.update()
}


/// CARGA DE CHART CUANDO SOLO SE ESCOJE UN PRODUCTO ////
function loadChartWhenOneProduct(dataProduct) {
  let ctx = document.getElementById('chartCost').getContext('2d')
  charCost = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Materia Prima', 'Costos Indirectos', 'Mano de Obra', 'Comisiones', 'Gastos Generales'],
      datasets: [{
        borderColor: '#fff',
        backgroundColor: color,
        borderWidth: 1,
        data: [$.number(dataProduct.rawMaterialExpenses, 2, '.'),
        $.number(dataProduct.indirectExpenses, 2, '.'),
        $.number(dataProduct.laborCost, 2, '.'),
        $.number(dataProduct.salesCommission, 2, '.'),
        $.number(dataProduct.generalExpenses, 2, '.')]
      }]
    },
    options: {
      responsive: true,
      legend: {
        display: false
      },
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            let value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]
            return ' $ ' + $.number(value, 2, ',', '.')
          }
        }
      },
      scales: {
        yAxes: [{
          display: true,
          ticks: {

          },
          gridLines: {
            offsetGridLines: true
          }
        }]
      },
      plugins: {
        datalabels: {
          align: 'end',
          anchor: 'center',
          clamp: true,
          backgroundColor: '#fff',
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
              size: w < 512 ? 12 : 14
            };
          },
          formatter: function (value, context) {
            return `$ ${$.number(value, 2, ',', '.')}`
          }
        }
      },
    }
  })
}


function calculateCoverExport(limInf) {
  if (dollar > 0) {
    $('#input-cover-export').val(dollar - limInf)
    $('#input-cover-export').number(true, 2, '.', ',')
  } else {
    setTimeout(() => {
      calculateCoverExport(limInf)
    }, 1000)
  }

}

// evento de cambio en la cantidad
$('.quantity-product').keyup(function () {
  let value = parseInt($(this).val())
  changeQuantity(value)
})
$('.quantity-product').change(function () {
  let value = parseInt($(this).val())
  changeQuantity(value)
})
function changeQuantity(value) {
  if (value <= 0) {
    $('.quantity-product').val(1)
    value = 1
  } else {
    $('.quantity-product').val(value)
  }
  productsReq.filter(product => product.id == $('#select-product').val())[0].quantity = parseInt(value)
  let productSelected = productsReq.filter(product => product.id == $('#select-product').val())[0]
  $(`#quantity-product-${productSelected.id}`).html(value)
  sessionStorage.setItem('products',JSON.stringify(productsReq))
  /* window.history.pushState('', 'change', '/app/cost/report.php?products=' + encodeURIComponent(JSON.stringify(productsReq))) */
  loadCost(productsReq.filter(product => product.id == $('#select-product').val())[0], true)
}


function quitSimulation() {
  $('#materiaPrimaCOP').off()
  $('#manoObraCOP').off()
  $('#costosIndirectosCOP').off()
  $('#gastosGeneralesCOP').off()
  $('#comisionCOP').off()
  $('#rentabilidadCOP').off()

  $('#materiaPrimaCOP').attr('readonly', true)
  $('#manoObraCOP').attr('readonly', true)
  $('#costosIndirectosCOP').attr('readonly', true)
  $('#gastosGeneralesCOP').attr('readonly', true)
  $('#comisionCOP').attr('readonly', true)
  $('#rentabilidadCOP').attr('readonly', true)

  document.getElementById('materiaPrimaUSD').readOnly = true;
  document.getElementById('manoObraUSD').readOnly = true;
  document.getElementById('costosIndirectosUSD').readOnly = true;
  document.getElementById('gastosGeneralesUSD').readOnly = true;
  document.getElementById('comisionUSD').readOnly = true;
  document.getElementById('rentabilidadUSD').readOnly = true;
}

const manoObraUSD = document.getElementById('manoObraUSD');
manoObraUSD.firstEvent = true;
const materiaPrimaUSD = document.getElementById('materiaPrimaUSD');
materiaPrimaUSD.firstEvent = true;
const costosIndirectosUSD = document.getElementById('costosIndirectosUSD');
const gastosGeneralesUSD = document.getElementById('gastosGeneralesUSD');
const comisionUSD = document.getElementById('comisionUSD');
const rentabilidadUSD = document.getElementById('rentabilidadUSD');

function simulationCost() {
  $('.number').number(true, 2, ',', '.')
  $('#materiaPrimaCOP').attr('readonly', false)
  $('#manoObraCOP').attr('readonly', false)
  $('#costosIndirectosCOP').attr('readonly', false)
  $('#gastosGeneralesCOP').attr('readonly', false)
  $('#comisionCOP').attr('readonly', false)
  $('#rentabilidadCOP').attr('readonly', false)

  $('#materiaPrimaCOP').on('input', sumCost);
  $('#manoObraCOP').on('input', sumCost);
  $('#costosIndirectosCOP').on('input', sumCost);
  $('#gastosGeneralesCOP').on('input', sumCost);
  $('#comisionCOP').on('input', calculatesalePrice);
  $('#rentabilidadCOP').on('input', calculatesalePrice);
  $('#totalCostosCOP').on('input', calculatesalePrice);


  //Habilitar Porcentajes
  
  manoObraUSD.readOnly = false;
  materiaPrimaUSD.readOnly = false;
  costosIndirectosUSD.readOnly = false;
  gastosGeneralesUSD.readOnly = false;
  comisionUSD.readOnly = false;
  rentabilidadUSD.readOnly = false;
  const costoCOP = document.getElementById('CostoCOP');
  const precioVentaCOP = document.getElementById('precioVentaCOP');

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
    costoCOP);
  gastosGeneralesUSD.oninput = startCostSimulation2.bind(null, gastosGeneralesUSD.value, $('#gastosCOP').val());
  comisionUSD.oninput = startCostSimulation2.bind(null, comisionUSD.value, $('#gastosCOP').val());
  rentabilidadUSD.oninput = cambioPorcentajeRentabilidad.bind(null, precioVentaCOP.value);

  manoObraUSDValue = manoObraUSD.value;
}

function sumCostPercentage(inputUSDVal, inputCOPVal, ev) {

  const inputTarget = ev.target;
  const costoCOPInput = document.getElementById('CostoCOP');
  const costoCOPval = parseFloat(costoCOPInput.value.replace('.', '').replace(',', '.'));
  const gastosCOPInput = document.getElementById('gastosCOP');
  const gastosCOPval = parseFloat(gastosCOPInput.value.replace('.', '').replace(',', '.'));
  let COPInput;

  switch (inputTarget.id) {
    case 'materiaPrimaUSD':
      COPInput = document.getElementById('materiaPrimaCOP');
     
      const pastCOPInputValue = COPInput.value;
      innerFn(materiaPrimaUSD, costoCOPval);
      break;
    case 'manoObraUSD':
      COPInput = document.getElementById('manoObraCOP');
      innerFn(manoObraUSD, costoCOPval);
      break;
    case 'costosIndirectosUSD':
      COPInput = document.getElementById('costosIndirectosCOP');
      innerFn(costosIndirectosUSD, costoCOPval);
      break;
    case 'gastosGeneralesUSD':
      COPInput = document.getElementById('gastosGeneralesCOP');
      innerFn(gastosGeneralesUSD, gastosCOPval);
      break;
    case 'comisionUSD': 
      COPInput = document.getElementById('comisionCOP');
      innerFn(comisionUSD, gastosCOPval);
      break;
    default:
      break;
  }

  sumCost2(inputTarget);
  
  function innerFn(USDInput, COPTotalInputVal) {
    if (ev.type === 'keyup' && inputTarget.value === inputUSDVal ) {
      COPInput.value = formatCurrency(parseFloat(inputCOPVal));
    }
    else {
      console.log(COPTotalInputVal, parseFloat(USDInput.value));
      const finalValueFormat = formatCurrency(COPTotalInputVal * parseFloat(USDInput.value) / 100);
      COPInput.value = finalValueFormat;
    }    
  }
}

function formatCurrency(resultadoFloat) {
  return $.number(resultadoFloat, 2, ',', '.')
}

function updateCostosFields(pastInputValue) {

  const costoCOPInput = document.getElementById('CostoCOP');
  const materiaPrimaCOP = document.getElementById('materiaPrimaCOP');
  pastInputValue = parseFloat(pastInputValue.replace('.', '').replace(',', '.'));
  const materiaPrimaCOPValue = parseFloat(materiaPrimaCOP.value.replace('.', '').replace(',', '.'));
  const diferenciaValores = pastInputValue -  materiaPrimaCOPValue;
}

function sumCost() {
  $('#CostoCOP').val(parseFloat($('#materiaPrimaCOP').val()) + parseFloat($('#manoObraCOP').val()) + parseFloat($('#costosIndirectosCOP').val()))
 /*  $('#gastosCOP').val($('#gastosGeneralesCOP').val()) */
 $('#gastosCOP').val(parseFloat($('#gastosGeneralesCOP').val()) + parseFloat($('#comisionCOP').val()));
  $('#totalCostosCOP').val(parseFloat($('#CostoCOP').val()) + parseFloat($('#gastosGeneralesCOP').val()))
  calculatesalePrice();
  calculateUSD();
}

function calculatesalePrice() {
  $('#precioVentaCOP').val(parseFloat($('#totalCostosCOP').val()) +
    parseFloat($('#comisionCOP').val()) + parseFloat($('#rentabilidadCOP').val()))
  calculateUSD()
  charCost.data.datasets[0].data = [
    $.number(parseFloat($('#materiaPrimaCOP').val()), 2, '.'),
    $.number(parseFloat($('#costosIndirectosCOP').val()), 2, '.'),
    $.number(parseFloat($('#manoObraCOP').val()), 2, '.'),
    $.number(parseFloat($('#comisionCOP').val()), 2, '.'),
    $.number(parseFloat($('#gastosGeneralesCOP').val()), 2, '.')
  ]
  charCost.update()
}

function calculateUSD() {
  // total de costos
  $('#totalCostosUSD').val((parseFloat($('#totalCostosCOP').val()) * 100 / parseFloat($('#precioVentaCOP').val())).toFixed(2) + " %")
  // precio de venta
  $('#precioVentaUSD').val("100.00 %")
  //costos
  $('#CostoUSD').val((parseFloat($('#CostoCOP').val())* 100 / parseFloat($('#totalCostosCOP').val())).toFixed(2) + " %")
  // materia prima
  $('#materiaPrimaUSD').val((parseFloat($('#materiaPrimaCOP').val()) * 100/ parseFloat($('#CostoCOP').val())).toFixed(2) + " %")
  //mano de obra
  $('#manoObraUSD').val((parseFloat($('#manoObraCOP').val()) * 100/ parseFloat($('#CostoCOP').val())).toFixed(2) + " %")
  //costos indirectos
  $('#costosIndirectosUSD').val((parseFloat($('#costosIndirectosCOP').val()) * 100 / parseFloat($('#CostoCOP').val())).toFixed(2)+ " %")
  // gastos
  $('#gastosUSD').val((parseFloat($('#gastosCOP').val()) * 100/ parseFloat($('#totalCostosCOP').val())).toFixed(2) + " %")
  // gastos generales
  $('#gastosGeneralesUSD').val((parseFloat($('#gastosGeneralesCOP').val()) * 100 / parseFloat($('#gastosCOP').val())).toFixed(2)+" %")
  // comision 
  $('#comisionUSD').val((parseFloat($('#comisionCOP').val())*100 / parseFloat($('#gastosCOP').val())).toFixed(2) + " %")
  // rentabilidad
  $('#rentabilidadUSD').val((parseFloat($('#rentabilidadCOP').val()) * 100 /  parseFloat($('#precioVentaCOP').val())).toFixed(2) + " %")
}


function sumCost2(newUSDInputNoCalc) {
  $('#CostoCOP').val(parseFloat($('#materiaPrimaCOP').val()) + parseFloat($('#manoObraCOP').val()) + parseFloat($('#costosIndirectosCOP').val()))
  $('#gastosCOP').val($('#gastosGeneralesCOP').val())
  $('#totalCostosCOP').val(parseFloat($('#CostoCOP').val()) + parseFloat($('#gastosGeneralesCOP').val()))
  /* calculatesalePrice(); */
   /* calculateUSD(); */
/*   calculateUSDPercentage(newUSDInputNoCalc); */
}


const totalCost = document.getElementById('CostoCOP');

function startCostSimulation2(inputValue, gastosValue, ev) {

  inputValue = parseFloat(inputValue);
   gastosValue = parseFloat(gastosValue);
  const inputTarget = ev.target;
  const inputTargetValue = parseFloat(inputTarget.value);
  const COPTarget = document.getElementById(`${inputTarget.id.replace('USD', 'COP')}`);
  const newCOPTargetValue = inputTargetValue *  gastosValue / 100;
  COPTarget.value = formatCurrency(newCOPTargetValue); 

  const diffCostAndtargetCOP = gastosValue -  newCOPTargetValue;

  const filterInputs = Array.from(document.querySelectorAll('input[id$="COP"]:not([readonly])'))
  .filter(input => input.id !== COPTarget.id && input.id !== 'rentabilidadCOP');

   const inputToChange = filterInputs[filterInputs.length - 1];
   inputToChange.value = formatCurrency(diffCostAndtargetCOP);
   const inputUSDToChange = document.getElementById(inputToChange.id.replace('COP', 'USD'));
   inputUSDToChange.value = (diffCostAndtargetCOP / gastosValue * 100).toFixed(2) + ' $';

   charCost.data.datasets[0].data = [
    $.number(parseFloat($('#materiaPrimaCOP').val()), 2, '.'),
    $.number(parseFloat($('#costosIndirectosCOP').val()), 2, '.'),
    $.number(parseFloat($('#manoObraCOP').val()), 2, '.'),
    $.number(parseFloat($('#comisionCOP').val()), 2, '.'),
    $.number(parseFloat($('#gastosGeneralesCOP').val()), 2, '.')
  ]
  charCost.update()
} 

function startCostSimulation(materiaPrimaUSDValue, manoObraUSDValue, costosIndirectosUSDValue, inputOption, ev) {
  manoObraUSDValue = parseFloat(manoObraUSDValue);
  costosIndirectosUSDValue = parseFloat(costosIndirectosUSDValue);
  materiaPrimaUSDValue = parseFloat(materiaPrimaUSDValue);

  const costValue = parseFloat(inputOption.value.replace('.', '').replace(',', '.'));
  const inputTarget = ev.target;
  const inputTargetValue = parseFloat(inputTarget.value);
  const COPTarget = document.getElementById(`${inputTarget.id.replace('USD', 'COP')}`);
  const newCOPTargetValue = inputTargetValue * costValue / 100;
  COPTarget.value = formatCurrency(newCOPTargetValue); 

  const diffCostAndtargetCOP = costValue -  newCOPTargetValue;

  if (inputTarget.id === 'materiaPrimaUSD') {

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
    const manoObraPart = diffCostAndtargetCOP * manoObraUSDValue / 100;
    const costosIndirectosPart = diffCostAndtargetCOP * costosIndirectosUSDValue / 100;

    const partToDistribute = diffCostAndtargetCOP - (manoObraPart + costosIndirectosPart);

    const manoObraCOP = document.getElementById('manoObraCOP');
    manoObraCOP.value = formatCurrency(manoObraPart + (partToDistribute / 2));
    const costosIndirectosCOP = document.getElementById('costosIndirectosCOP');
    costosIndirectosCOP.value = formatCurrency(costosIndirectosPart + (partToDistribute / 2));

     const manoObraCOPValue =  parseFloat(manoObraCOP.value.replace('.', '').replace(',', '.'));
     const costosIndirectosCOPValue = parseFloat(costosIndirectosCOP.value.replace('.', '').replace(',', '.'));

    manoObraUSD.value = (manoObraCOPValue / costValue * 100).toFixed(2) + ' %';
    costosIndirectosUSD.value = ((costosIndirectosCOPValue / costValue * 100).toFixed(2) + ' %');
    
  } else if(inputTarget.id === 'manoObraUSD') {

    const materiaPrimaPart = diffCostAndtargetCOP * materiaPrimaUSDValue / 100;
    const costosIndirectosPart = diffCostAndtargetCOP * costosIndirectosUSDValue / 100;
    
    const partToDistribute = diffCostAndtargetCOP - (materiaPrimaPart + costosIndirectosPart);

    const materiaPrimaCOP = document.getElementById('materiaPrimaCOP');
    materiaPrimaCOP.value = formatCurrency(materiaPrimaPart + (partToDistribute / 2));
    const costosIndirectosCOP = document.getElementById('costosIndirectosCOP');
    costosIndirectosCOP.value = formatCurrency(costosIndirectosPart + (partToDistribute / 2));

     const materiaPrimaCOPValue =  parseFloat(materiaPrimaCOP.value.replace('.', '').replace(',', '.'));
     const costosIndirectosCOPValue = parseFloat(costosIndirectosCOP.value.replace('.', '').replace(',', '.'));

    materiaPrimaUSD.value = (materiaPrimaCOPValue / costValue * 100).toFixed(2) + ' %';
    costosIndirectosUSD.value = ((costosIndirectosCOPValue / costValue * 100).toFixed(2) + ' %');

  } else {

    const materiaPrimaPart = diffCostAndtargetCOP * materiaPrimaUSDValue / 100;
    const manoObraPart = diffCostAndtargetCOP * manoObraUSDValue / 100;
    
    const partToDistribute = diffCostAndtargetCOP - (materiaPrimaPart + manoObraPart);

    const materiaPrimaCOP = document.getElementById('materiaPrimaCOP');
    materiaPrimaCOP.value = formatCurrency(materiaPrimaPart + (partToDistribute / 2));
    const manoObraCOP = document.getElementById('manoObraCOP');
    manoObraCOP.value = formatCurrency(manoObraPart + (partToDistribute / 2));

     const materiaPrimaCOPValue =  parseFloat(materiaPrimaCOP.value.replace('.', '').replace(',', '.'));
     const manoObraCOPValue =  parseFloat(manoObraCOP.value.replace('.', '').replace(',', '.'));

    materiaPrimaUSD.value = (materiaPrimaCOPValue / costValue * 100).toFixed(2) + ' %';
    manoObraUSD.value = (manoObraCOPValue / costValue * 100).toFixed(2) + ' %';


  }

        charCost.data.datasets[0].data = [
          $.number(parseFloat($('#materiaPrimaCOP').val()), 2, '.'),
          $.number(parseFloat($('#costosIndirectosCOP').val()), 2, '.'),
          $.number(parseFloat($('#manoObraCOP').val()), 2, '.'),
          $.number(parseFloat($('#comisionCOP').val()), 2, '.'),
          $.number(parseFloat($('#gastosGeneralesCOP').val()), 2, '.')
        ]
        charCost.update();
} 


function cambioPorcentajeRentabilidad(inputPrecioVentaCOPValue, ev) {
  inputPrecioVentaCOPValue = inputPrecioVentaCOPValue.replace('.', '').replace(',', '.');
  const rentabilidadUSD = ev.target;
  const rentabilidadUSDValue = parseFloat(rentabilidadUSD.value);
  const totalCostosCOP = document.getElementById('totalCostosCOP');

/*   const totalCostosCOPValue = parseFloat(totalCostosCOP.value.replace('.', '').replace(',', '.')); */
  const totalCostosUSD = document.getElementById('totalCostosUSD');
  const rentabilidadCOP = document.getElementById('rentabilidadCOP');

  const newRentabilidadCOPValue =  rentabilidadUSDValue * inputPrecioVentaCOPValue / 100;
  const newCostosUSDValue = 100 - rentabilidadUSDValue;
  const newCostosCOPValue = inputPrecioVentaCOPValue * newCostosUSDValue / 100;

  rentabilidadCOP.value = formatCurrency(newRentabilidadCOPValue);
  totalCostosUSD.value = newCostosUSDValue.toFixed(2) + ' %';
  totalCostosCOP.value = formatCurrency(newCostosCOPValue);
}

