function uploadProcesses(processes) {
  loadingSpinner()
  $.post('api/upload_processes.php', { processes: JSON.stringify(processes) }, (data, status) => {
    if (status == 'success') {
      let countSuccess = 0
      let countfailed = 0
      for (let index = 0; index < data.length; index++) {
        if (data[index]) {
          countSuccess++;
        } else {
          countfailed++
        }
      }
      $.notify({
        icon: "nc-icon nc-bell-55",
        message: `Se ${countSuccess > 1 ? 'han' : 'ha'} cargado ${countSuccess} ${countSuccess > 1 ? 'procesos' : 'proceso'}`
      }, {
        type: 'success',
        timer: 8000
      })
      if (countfailed > 0) {
        $.notify({
          icon: "nc-icon nc-bell-55",
          message: `${countfailed} procesos ya se encontraban en la base de datos`
        }, {
          type: 'info',
          timer: 8000
        })
      }

      $tableProcesos.api().ajax.reload()
      completeSpinner()
      loadProcessesInRoster()
    }
  })
}

function validateJSONToExcelProcess(jsonObj) {
  for (let index = 0; index < jsonObj.length; index++) {
    let process = jsonObj[index]
    if (!(process.Proceso != undefined)) {
      return false;
    }
  }
  return true
}

/**
 * Cargado de procesos por datos de excel
 */
$('#fileProcess').change(function () {
  var reader = new FileReader()
  let file = this.files[0]
  let inputFile = this
  $(this).siblings('label').text(file.name)
  reader.onloadend = function () {
    let data = new Uint8Array(reader.result)
    let workbook = XLSX.read(data, { type: 'array' })
    let workSheet = workbook.Sheets['Procesos']
    let processes = XLSX.utils.sheet_to_json(workSheet)
    if (validateJSONToExcelProcess(processes)) {
      if (processes.length == 0) {
        $.alert({
          title: 'Peligro',
          content: 'Este Archivo Esta vacio',
          type: 'red'
        });
      } else {
        $.confirm({
          title: 'Tezlik',
          content: 'Los datos han sido procesados y estan listo para ser cargados',
          type: 'green',
          buttons: {
            Cargar: function () {
              uploadProcesses(processes)
              clearFile(inputFile)
            },
            Cancelar: function () {
              $.alert('Cancelado')
              clearFile(inputFile)
            }
          }
        })
      }
    } else {
      $.alert({
        title: 'Peligro',
        content: 'Este Archivo no cumple los formatos indicados',
        type: 'red',
      })
      clearFile(inputFile)
    }
  }
  if (file) {
    reader.readAsArrayBuffer(file)
  }
})

function generateFileProcesses() {
  loadingSpinner()
  $.get('api/get_processes.php', (data, status) => {
    // creacion del libro de excel
    var wb = XLSX.utils.book_new()
    // configuración de del libro
    wb.Props = {
      Title: "Procesos de Cotizador",
      Subject: "Tezlik",
      Author: "Tezlik",
      CreatedDate: new Date()
    }
    // agregado de los nombres de las hojas del libro
    wb.SheetNames.push('Procesos')
    // creacion de variables para cargar la información de los productos
    let ws_data = []
    // cargado de de productos con referencias
    data.forEach((process) => {
      ws_data.push({
        Proceso: process.name,
      })
    })
    // parseo de objetos a las hojas de excel
    if (ws_data.length <= 0) {
      saveAs('/formatos/formato-procesos.xlsx', 'formato-procesos.xlsx')
    } else {
      var ws = XLSX.utils.json_to_sheet(ws_data)
      // asignacion de hojas de excel
      wb.Sheets["Procesos"] = ws

      var wopts = { bookType: 'xlsx', bookSST: false, type: 'array' }

      var wbout = XLSX.write(wb, wopts)
      saveAs(new Blob([wbout], { type: "application/octet-stream" }), 'Procesos.xlsx')


    }
    completeSpinner()
  })
}

