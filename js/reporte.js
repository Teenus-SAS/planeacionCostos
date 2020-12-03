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
      quantity: product.quantity
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
}

function simulationCost() {
  $('.number').number(true, 2, ',', '.')
  $('#materiaPrimaCOP').attr('readonly', false)
  $('#manoObraCOP').attr('readonly', false)
  $('#costosIndirectosCOP').attr('readonly', false)
  $('#gastosGeneralesCOP').attr('readonly', false)
  $('#comisionCOP').attr('readonly', false)
  $('#rentabilidadCOP').attr('readonly', false)

  $('#materiaPrimaCOP').keyup(sumCost)
  $('#manoObraCOP').keyup(sumCost)
  $('#costosIndirectosCOP').keyup(sumCost)
  $('#gastosGeneralesCOP').keyup(sumCost)
  $('#comisionCOP').keyup(calculatesalePrice)
  $('#rentabilidadCOP').keyup(calculatesalePrice)
  $('#totalCostosCOP').keyup(calculatesalePrice)

  $('#materiaPrimaCOP').change(sumCost)
  $('#manoObraCOP').change(sumCost)
  $('#costosIndirectosCOP').change(sumCost)
  $('#gastosGeneralesCOP').change(sumCost)
  $('#comisionCOP').change(calculatesalePrice)
  $('#rentabilidadCOP').change(calculatesalePrice)
  $('#totalCostosCOP').change(calculatesalePrice)

}

function sumCost() {
  $('#CostoCOP').val(parseFloat($('#materiaPrimaCOP').val()) + parseFloat($('#manoObraCOP').val()) + parseFloat($('#costosIndirectosCOP').val()))
  $('#gastosCOP').val($('#gastosGeneralesCOP').val())
  $('#totalCostosCOP').val(parseFloat($('#CostoCOP').val()) + parseFloat($('#gastosGeneralesCOP').val()))
  calculatesalePrice()
  calculateUSD()
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
  $('#totalCostosUSD').val((parseFloat($('#totalCostosCOP').val()) * 100 / parseFloat($('#precioVentaCOP').val())).toFixed(2) + "%")
  // precio de venta
  $('#precioVentaUSD').val("100.00 %")
  //costos
  $('#CostoUSD').val((parseFloat($('#CostoCOP').val())* 100 / parseFloat($('#totalCostosCOP').val())).toFixed(2) + "%")
  // materia prima
  $('#materiaPrimaUSD').val((parseFloat($('#materiaPrimaCOP').val()) * 100/ parseFloat($('#CostoCOP').val())).toFixed(2) + "%")
  //mano de obra
  $('#manoObraUSD').val((parseFloat($('#manoObraCOP').val()) * 100/ parseFloat($('#CostoCOP').val())).toFixed(2) + "%")
  //costos indirectos
  $('#costosIndirectosUSD').val((parseFloat($('#costosIndirectosCOP').val()) * 100 / parseFloat($('#CostoCOP').val())).toFixed(2)+ "%")
  // gastos
  $('#gastosUSD').val((parseFloat($('#gastosCOP').val()) * 100/ parseFloat($('#totalCostosCOP').val())).toFixed(2) + "%")
  // gastos generales
  $('#gastosGeneralesUSD').val((parseFloat($('#gastosGeneralesCOP').val()) * 100 / parseFloat($('#gastosCOP').val())).toFixed(2)+"%")
  // comision 
  $('#comisionUSD').val((parseFloat($('#comisionCOP').val())*100 / parseFloat($('#gastosCOP').val())).toFixed(2) + "%")
  // rentabilidad
  $('#rentabilidadUSD').val((parseFloat($('#rentabilidadCOP').val()) * 100 /  parseFloat($('#precioVentaCOP').val())).toFixed(2) + "%")
}
