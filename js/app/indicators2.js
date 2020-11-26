/**
* @author Alexis Holguin
* @github MoraHol
* 
* Funcionalidad para crear graficos de indicadores
*/

let params = new URLSearchParams(location.search)
var id = JSON.parse(params.get('id'))
let quantity = JSON.parse(params.get('quantity'))


$.get('api/indicators.php', {
  id,
  quantity
}, (data, status) => {
  var manoObraDataChart = []
  var timeProcessDataChart = []
  data.ManoObra.forEach(roster => {
    manoObraDataChart.push([roster.process, roster.costo])
  })
  console.log('mano de obra chart',manoObraDataChart);

  data.processes.forEach((process) => {
    timeProcessDataChart.push({
      name: process.name,
      y: process.time
    })
  })

  // configuracion grafico de procesos
  let chartProcess = $('#chartProcess').highcharts({
    chart: {
      type: 'pie',
      options3d: {
        enabled: true,
        alpha: 50,
        beta: 0
      }
    },
    title: {
      text: 'Total Tiempo de Procesos'
    },
    tooltip: {
      pointFormat: 'Porcentaje: <b>{point.percentage:.1f}%</b> <br> {series.name}: <b>{point.y:.2f} min</b>'
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        depth: 35,
        dataLabels: {
          enabled: true,
          format: '{point.name}'
        }
      }
    },
    series: [{
      type: 'pie',
      name: 'Tiempo',
      data: timeProcessDataChart
    }]
  });

  // configuracion grafico de mano de obra
  Highcharts.chart('chartLaborCost', {
    chart: {
      type: 'column'
    },
    title: {
      text: 'Costo Mano de Obra'
    },
    xAxis: {
      type: 'category',
      labels: {
        rotation: -45,
        style: {
          fontSize: '13px',
          fontFamily: 'Verdana, sans-serif'
        }
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Costo (pesos)'
      }
    },
    plotOptions: {
      column: {
        borderRadius: 5
      }
    },
    legend: {
      enabled: false
    },
    tooltip: {
      /* pointFormat: 'Costo de mano de Obra: <b> $ {point.y:.2f} </b>' */
      pointFormatter: function () {
        return `Costo de mano de Obra: <b>$ ${Highcharts.numberFormat(this.y, '2', ',')} </b>`;
        }
    },
    series: [{
      name: 'Mano de Obra',
      dataSorting: {
        enabled: true,
      },
      data: manoObraDataChart,
      dataLabels: {
        enabled: true,
        rotation: -90,
        color: '#FFFFFF',
        align: 'right',
        inside: true,
        formatter: function () {
          return `$ ${Highcharts.numberFormat(this.y, '2', ',')}`;
          },
        /* format: '$ {point.y:.1f}',  */
        // one decimal
        y: -30, // 10 pixels down from the top
        style: {
          fontSize: '13px',
          fontFamily: 'Verdana, sans-serif'
        }
      }
    }],

  })
  // configuracion grafico de gastos generales
  var expensesDataChart = []
  if (data.expensesDescription == false) {
    expensesDataChart.push(['Gastos Generales', parseFloat(data.totalExpenses)])
  } else {
    expensesDataChart.push(['Gastos Operacionales de Administración', data.expensesDescription['51'].value])
    expensesDataChart.push(['Gastos Operacionales de Ventas', data.expensesDescription['52'].value])
    expensesDataChart.push(['Gastos No operacionales', data.expensesDescription['53'].value])

    expensesDataChart.push(['Costos indirectos de fabricación', data.expensesDescription['73'].value])
    expensesDataChart.push(['Contrato de servicios', data.expensesDescription['74'].value])
  }
  Highcharts.chart('chartExpensesGeneral', {
    chart: {
      type: 'pie',
      options3d: {
        enabled: true,
        alpha: 45
      }
    },
    title: {
      text: 'Gastos Generales'
    },
    plotOptions: {
      pie: {
        innerSize: 100,
        depth: 45
      }
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b> <br> {series.name}: <b> $ {point.y:.2f} </b>'
    },
    series: [{
      name: 'Gastos',
      data: expensesDataChart
    }]
  })

  //configuracion de materiales

  var rawMaterialsDataChart = []
  let totalMaterial = data.rawMaterialExpenses
  data.rawMaterials.sort(function (a, b) {
    return b.cost - a.cost
  })

  data.rawMaterials.forEach((rawMaterial) => {
    rawMaterialsDataChart.push([rawMaterial.material, (parseFloat(rawMaterial.cost) * 100) / totalMaterial])
  })
  Highcharts.chart('chartRawMaterialsCost', {
    chart: {
      type: 'column'
    },
    title: {
      text: 'Costo de Materia Prima'
    },
    xAxis: {
      type: 'category',
      labels: {
        rotation: -45,
        style: {
          fontSize: '13px',
          fontFamily: 'Verdana, sans-serif'
        }
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Costo (pesos)'
      }
    },
    legend: {
      enabled: false
    },
    tooltip: {
      formatter: function () {
        return '<b>' + this.point.name.toLowerCase() + '</b><br/>' +
          `Costo de materia prima:  <b> $  ${$.number((this.point.y * totalMaterial) / 100, 2, ',', '.')} </b> <br>
          Porcentaje: <b>${$.number(this.point.y, 2, ',', '.')} % </b>`
      }
    },
    plotOptions: {
      series: {
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: '{point.y:.1f}%'
        }
      },
      column: {
        borderRadius: 5
      }
    },
    series: [{
      name: 'Materia Prima',
      data: rawMaterialsDataChart
    }],

  })
})

console.log($("#chartProcess").highcharts())