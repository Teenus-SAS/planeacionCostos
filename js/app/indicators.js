/**
* @author Alexis Holguin
* @github MoraHol
* 
* Funcionalidad para crear graficos de indicadores
*/

let params = new URLSearchParams(location.search)
var id = JSON.parse(params.get('id'))
let quantity = JSON.parse(params.get('quantity'))




let colors = [
  '#4acccd', '#fcc468', '#f17e5d', '#6bd098',  '#f8e286', '#a4bae3', '#7030a0', '#ffc000', '#ff0000', '#203864'
]

$.get('api/indicators.php', {
  id,
  quantity
}, (data, status) => {
  let namesProcess = []
  let valuesProcess = []
  let colorsProcess = []
  data.processes.forEach((process) => {
    namesProcess.push(process.name)
    valuesProcess.push(parseFloat(process.time))
    colorsProcess.push(colors[Math.floor(Math.random() * (colors.length - 0)) + 0])
  })
  // cargado de grafico de procesos
  let ctxProcess = document.getElementById('chartProcess').getContext('2d')
  let chartProcess = new Chart(ctxProcess, {
    type: 'pie',
    data: {
      datasets: [{
        data: valuesProcess,
        backgroundColor: colorsProcess,
        datalabels: {
          anchor: 'center'
        }
      }],
      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: namesProcess
    },
    options: {
      responsive: true,
      legend: {
        display: false
      },
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            var label = data.labels[tooltipItem.index] || '';

            if (label) {
              label += ': ';
            }
            let value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]
            let total = data.datasets[tooltipItem.datasetIndex]._meta[tooltipItem.datasetIndex].total
            label += $.number((value * 100) / total, 2) + '%'
            return label;
          }
        }
      },
      plugins: {
        datalabels: {
          backgroundColor: function (context) {
            return context.dataset.backgroundColor;
          },
          borderColor: 'white',
          borderRadius: 25,
          borderWidth: 2,
          color: 'white',
          font: {
            weight: 'bold'
          },
          formatter: function (value, context) {
            var label = context.chart.data.labels[context.dataIndex] || '';

            if (label) {
              label += ': ';
            }
            let total = context.chart.data.datasets[context.datasetIndex]._meta[context.datasetIndex].total
            label += $.number((value * 100) / total, 2) + '%'
            return label;
          }
        }
      }
    }
  })

  // Cargado de grafico de mano de obra
  let ctxLaborCost = document.getElementById('chartLaborCost').getContext('2d')
  let namesProcessLC = []
  let valuesLaborCost = []
  let colorsLaborCost = []
  data.ManoObra.forEach((ManoObra) => {
    namesProcessLC.push(ManoObra.process)
    valuesLaborCost.push(parseFloat(ManoObra.costo))
    colorsLaborCost.push(colors[Math.floor(Math.random() * (colors.length - 0)) + 0])
  })
  let chartLaborCost = new Chart(ctxLaborCost, {
    type: 'bar',
    data: {
      datasets: [{
        data: valuesLaborCost,
        backgroundColor: colorsLaborCost
      }],
      labels: namesProcessLC
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
      plugins: {
        datalabels: {
          align: 'end',
          anchor: 'end',
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

  // Cargado de grafico de materiales

  let ctxRawMaterials = document.getElementById('chartRawMaterialsCost').getContext('2d')
  let namesMaterials = []
  let valuesMaterials = []
  let colorsMaterials = []
  let totalMaterial = data.rawMaterialExpenses
  data.rawMaterials.sort(function (a, b) {
    return b.cost - a.cost
  })
  data.rawMaterials.forEach((rawMaterial) => {
    namesMaterials.push(rawMaterial.material)
    valuesMaterials.push(parseFloat(rawMaterial.cost))
    colorsMaterials.push(colors[Math.floor(Math.random() * (colors.length - 0)) + 0])
  })
  let chartMaterialCost = new Chart(ctxRawMaterials, {
    type: 'bar',
    data: {
      datasets: [{
        data: valuesMaterials,
        backgroundColor: colorsMaterials
      }],
      labels: namesMaterials
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
            return $.number((value * 100) / totalMaterial, 2) + '%'
          }
        }
      },
      plugins: {
        datalabels: {
          align: 'end',
          anchor: 'end',
          color: function (context) {
            return context.dataset.backgroundColor;
          },
          font: {
            weight: 'bold'
          },
          formatter: function (value, context) {
            return `valor: $ ${$.number(value, 2, ',', '.')} \nporcenaje: ${$.number((value * 100) / totalMaterial, 2)} %`
          }
        }
      },
    }
  })

  // Cargado de grafico de Gastos Generales
  let valuesExpenses = []
  let colorsExpenses = []
  let names = []
  if (data.expensesDescription == false) {
    valuesExpenses.push(data.totalExpenses)
    colorsExpenses.push(colors[Math.floor(Math.random() * (colors.length - 0)) + 0])
    names.push('Gastos generales')
  } else {
    names = ['Gastos Operacionales de Administración', 'Gastos Operacionales de Ventas',
      'Gastos No operacionales',
      'Costos indirectos de fabricación', 'Contrato de servicios']
    for (let i = 0; i < names.length; i++) {
      colorsExpenses.push(colors[Math.floor(Math.random() * (colors.length - 0)) + 0])
    }
    valuesExpenses.push(data.expensesDescription['51'].value)
    valuesExpenses.push(data.expensesDescription['52'].value)
    valuesExpenses.push(data.expensesDescription['53'].value)
    valuesExpenses.push(data.expensesDescription['73'].value)
    valuesExpenses.push(data.expensesDescription['74'].value)
  }
  let ctxExpensesDescription = document.getElementById('chartExpensesGeneral').getContext('2d')
  let chartExpensesDescription = new Chart(ctxExpensesDescription, {
    type: 'doughnut',
    data: {
      datasets: [
        {
          data: valuesExpenses,
          backgroundColor: colorsExpenses,
          datalabels: {
            anchor: 'center',
            align: 'end'
          }
        }
      ],
      labels: names,

    },
    options: {
      responsive: true,
      legend: {
        display: false
      },
      plugins: {
        datalabels: {
          backgroundColor: function (context) {
            return context.dataset.backgroundColor;
          },
          borderColor: 'white',
          borderRadius: 25,
          borderWidth: 2,
          color: 'white',
          display: function (context) {
            var dataset = context.dataset;
            var count = dataset.data.length;
            var value = dataset.data[context.dataIndex];
            return value > count * 1.5;
          },
          font: {
            weight: 'bold'
          },
          formatter: function (value, context) {
            return `${context.chart.data.labels[context.dataIndex]}: \n $ ${$.number(value, 0, ',', '.')}`
          }

        }

      },
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            var label = data.labels[tooltipItem.index] || '';

            if (label) {
              label += ': ';
            }

            let value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]
            return label + ' $ ' + $.number(value, 2, ',', '.')
          }
        }
      }
    }
  })
})

