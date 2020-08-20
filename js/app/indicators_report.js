
// cargado de grafico de procesos
let ctxProcess = document.getElementById('chartProcess').getContext('2d')
let chartProcess = new Chart(ctxProcess, {
  type: 'pie',
  data: {
    datasets: [{
      data: [],
      backgroundColor: [],
      datalabels: {
        anchor: 'center'
      }
    }],
    // These labels appear in the legend and in the tooltips when hovering different arcs
    labels: []
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

let chartLaborCost = new Chart(ctxLaborCost, {
  type: 'bar',
  data: {
    datasets: [{
      data: [],
      backgroundColor: []
    }],
    labels: []
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

// Cargado de grafico de materiales

let ctxRawMaterials = document.getElementById('chartRawMaterialsCost').getContext('2d')
let chartMaterialCost = new Chart(ctxRawMaterials, {
  type: 'bar',
  data: {
    datasets: [{
      data: [],
      backgroundColor: []
    }],
    labels: []
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
        font: {
          weight: 'bold'
        },
      }
    },
  }
})


// Cargado de grafico de Gastos Generales
let ctxExpensesDescription = document.getElementById('chartExpensesGeneral').getContext('2d')
let chartExpensesDescription = new Chart(ctxExpensesDescription, {
  type: 'doughnut',
  data: {
    datasets: [
      {
        data: [],
        backgroundColor: [],
        datalabels: {
          anchor: 'center',
        }
      }
    ],
    labels: [],

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
